"use server";

import { headers } from "next/headers";
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

  const capacity = await checkSlotCapacity(data.pickupDate, data.pickupTime, data.cartonCount);
  if (!capacity.ok) {
    return {
      status: "error",
      message: capacity.reason,
      fieldErrors: { pickupTime: capacity.reason },
    };
  }

  const productId = PRODUCT_TO_ID[data.product];
  const product = getProduct(productId);
  const eggCount = product.eggCount * data.cartonCount;
  const totalPrice = getProductPrice(productId) * data.cartonCount;

  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      product: data.product,
      cartonCount: data.cartonCount,
      eggCount,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      note: data.note || null,
      consentAt: new Date(),
    },
  });

  return {
    status: "success",
    summary: {
      name: reservation.name,
      productLabel: product.label,
      cartonCount: reservation.cartonCount,
      eggCount: reservation.eggCount,
      totalPrice,
      pickupDate: reservation.pickupDate,
      pickupTime: reservation.pickupTime,
    },
  };
}
