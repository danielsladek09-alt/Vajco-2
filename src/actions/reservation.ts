"use server";

import { headers } from "next/headers";
import { Prisma, type Reservation } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation";
import { checkSlotCapacity } from "@/lib/slots";
import { isRateLimited } from "@/lib/rate-limit";
import { getProduct, getProductPrice, type ProductId } from "@/config/site";

export interface ReservationSummary {
  name: string;
  productLabel: string;
  cartonCount: number;
  eggCount: number;
  totalPrice: number;
  pickupDate: string;
  pickupTime: string;
}

export interface ReservationActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  summary?: ReservationSummary;
}

const PRODUCT_TO_ID: Record<string, ProductId> = {
  CARTON_12: "carton-12",
  CARTON_30: "carton-30",
};

// Sériové (Serializable) transakce podporuje Prisma jen pro Postgres —
// pro SQLite se volba prostě vynechá (SQLite beztak zamyká celý soubor
// při zápisu, takže dvě souběžné transakce se v praxi neprolnou).
const isPostgres = (process.env.DATABASE_URL ?? "").startsWith("postgres");
const MAX_ATTEMPTS = 3;

class SlotCapacityError extends Error {}

/**
 * Vytvoří rezervaci uvnitř DB transakce, kde se kapacita slotu
 * kontroluje a zapisuje atomicky — viz PROJECT_AUDIT.md, Riziko #1
 * (race condition: dva lidé rezervují poslední místo současně).
 */
async function reserveInTransaction(input: {
  name: string;
  phone: string;
  email: string;
  product: "CARTON_12" | "CARTON_30";
  cartonCount: number;
  eggCount: number;
  pickupDate: string;
  pickupTime: string;
  note?: string;
  clientToken: string;
}) {
  return prisma.$transaction(
    async (tx) => {
      const capacity = await checkSlotCapacity(
        input.pickupDate,
        input.pickupTime,
        input.cartonCount,
        tx,
      );
      if (!capacity.ok) {
        throw new SlotCapacityError(capacity.reason);
      }
      return tx.reservation.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          product: input.product,
          cartonCount: input.cartonCount,
          eggCount: input.eggCount,
          pickupDate: input.pickupDate,
          pickupTime: input.pickupTime,
          note: input.note || null,
          clientToken: input.clientToken,
          consentAt: new Date(),
        },
      });
    },
    isPostgres ? { isolationLevel: Prisma.TransactionIsolationLevel.Serializable } : undefined,
  );
}

function toSummary(reservation: Reservation, productLabel: string, totalPrice: number): ReservationSummary {
  return {
    name: reservation.name,
    productLabel,
    cartonCount: reservation.cartonCount,
    eggCount: reservation.eggCount,
    totalPrice,
    pickupDate: reservation.pickupDate,
    pickupTime: reservation.pickupTime,
  };
}

export async function createReservation(
  _prevState: ReservationActionState,
  formData: FormData,
): Promise<ReservationActionState> {
  // Honeypot — skryté pole, které vidí jen boti. Pokud je vyplněné, tiše
  // předstíráme úspěch a nic neukládáme.
  if (formData.get("website")) {
    return { status: "success" };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Zkoušíš to moc rychle za sebou. Zkus to prosím za pár minut.",
    };
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    product: formData.get("product")?.toString(),
    cartonCount: Number(formData.get("cartonCount")),
    pickupDate: formData.get("pickupDate")?.toString() ?? "",
    pickupTime: formData.get("pickupTime")?.toString() ?? "",
    note: formData.get("note")?.toString() ?? "",
    consent: formData.get("consent") === "on",
    clientToken: formData.get("clientToken")?.toString() ?? "",
  };

  const parsed = reservationSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      status: "error",
      message: "Zkontroluj prosím zvýrazněná pole.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const productId = PRODUCT_TO_ID[data.product];
  const product = getProduct(productId);
  const eggCount = product.eggCount * data.cartonCount;
  const totalPrice = getProductPrice(productId) * data.cartonCount;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const reservation = await reserveInTransaction({ ...data, eggCount });
      return { status: "success", summary: toSummary(reservation, product.label, totalPrice) };
    } catch (err) {
      if (err instanceof SlotCapacityError) {
        return {
          status: "error",
          message: err.message,
          fieldErrors: { pickupTime: err.message },
        };
      }

      // Stejný clientToken už existuje → tohle je duplicitní odeslání
      // (dvojklik / zopakovaný request). Vrátíme výsledek té PRVNÍ
      // rezervace, ne chybu — pro zákazníka to musí vypadat jako jeden
      // úspěšný požadavek.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const existing = await prisma.reservation.findUnique({
          where: { clientToken: data.clientToken },
        });
        if (existing) {
          const existingProduct = getProduct(PRODUCT_TO_ID[existing.product]);
          return {
            status: "success",
            summary: toSummary(
              existing,
              existingProduct.label,
              getProductPrice(PRODUCT_TO_ID[existing.product]) * existing.cartonCount,
            ),
          };
        }
      }

      // Serializační konflikt na Postgres (souběh dvou transakcí na
      // stejném slotu) — zkusit znovu s malým odstupem.
      const isSerializationConflict =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2034";
      if (isSerializationConflict && attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 75 * attempt));
        continue;
      }

      console.error("Rezervaci se nepodařilo uložit:", err);
      return {
        status: "error",
        message: "Něco se nepovedlo. Zkus to prosím znovu za chvíli.",
      };
    }
  }

  return {
    status: "error",
    message: "Něco se nepovedlo. Zkus to prosím znovu za chvíli.",
  };
}
