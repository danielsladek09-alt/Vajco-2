import "server-only";

import type { Prisma } from "@prisma/client";
import { reservationConfig } from "@/config/reservations";
import { prisma } from "@/lib/prisma";
import {
  WEEKDAY_LABELS,
  dateStringToWeekday,
  getLeadCutoff,
  getSlotsForDate,
  listCandidateDates,
  timeToMinutes,
} from "@/lib/slot-math";

export { getSlotsForDate, listCandidateDates, getTodayDateString } from "@/lib/slot-math";

/** Buď sdílený Prisma klient, nebo klient uvnitř probíhající transakce. */
type Db = typeof prisma | Prisma.TransactionClient;

export interface SlotOption {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  reservationsLeft: number;
  cartonsLeft: number;
  isFull: boolean;
}

export interface PickupDateOption {
  date: string; // "YYYY-MM-DD"
  weekday: string;
  dayLabel: string;
  hasAvailability: boolean;
}

/**
 * Vrátí dostupnost všech slotů pro daný den — kolik rezervací/kartonů se
 * ještě vejde, s ohledem na už uložené rezervace v databázi a na minimální
 * předstih rezervace.
 */
export async function getAvailableSlotsForDate(
  date: string,
  db: Db = prisma,
): Promise<SlotOption[]> {
  const allSlots = getSlotsForDate(date);
  if (allSlots.length === 0) return [];

  const cutoff = getLeadCutoff();
  const usableSlots =
    date < cutoff.date
      ? []
      : date === cutoff.date
        ? allSlots.filter((time) => timeToMinutes(time) >= cutoff.minutes)
        : allSlots;

  if (usableSlots.length === 0) return [];

  const existing = await db.reservation.findMany({
    where: { pickupDate: date, status: { not: "CANCELLED" } },
    select: { pickupTime: true, cartonCount: true },
  });

  const usage = new Map<string, { reservations: number; cartons: number }>();
  for (const r of existing) {
    const entry = usage.get(r.pickupTime) ?? { reservations: 0, cartons: 0 };
    entry.reservations += 1;
    entry.cartons += r.cartonCount;
    usage.set(r.pickupTime, entry);
  }

  return usableSlots.map((time) => {
    const used = usage.get(time) ?? { reservations: 0, cartons: 0 };
    const reservationsLeft = Math.max(
      0,
      reservationConfig.maxReservationsPerSlot - used.reservations,
    );
    const cartonsLeft = Math.max(0, reservationConfig.maxCartonsPerSlot - used.cartons);
    return {
      date,
      time,
      reservationsLeft,
      cartonsLeft,
      isFull: reservationsLeft === 0 || cartonsLeft === 0,
    };
  });
}

/** Seznam vybíratelných dat pro formulář, s příznakem, jestli má den ještě volno. */
export async function getPickupDateOptions(): Promise<PickupDateOption[]> {
  const dates = listCandidateDates();

  const results = await Promise.all(
    dates.map(async (date) => {
      const slots = await getAvailableSlotsForDate(date);
      const hasAvailability = slots.some((s) => !s.isFull);
      const [, m, d] = date.split("-");
      return {
        date,
        weekday: WEEKDAY_LABELS[dateStringToWeekday(date)],
        dayLabel: `${d}. ${m}.`,
        hasAvailability,
      };
    }),
  );

  return results;
}

/** Ověří, že konkrétní slot má ještě místo na daný počet kartonů — voláno i server-side při odesílání rezervace. */
export async function checkSlotCapacity(
  date: string,
  time: string,
  cartonCount: number,
  db: Db = prisma,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const slots = await getAvailableSlotsForDate(date, db);
  const slot = slots.find((s) => s.time === time);

  if (!slot) {
    return { ok: false, reason: "Tenhle termín už bohužel není k dispozici." };
  }
  if (slot.reservationsLeft < 1) {
    return { ok: false, reason: "Tenhle čas je už plně obsazený. Vyber prosím jiný." };
  }
  if (slot.cartonsLeft < cartonCount) {
    return {
      ok: false,
      reason: `V tomto čase už máme rezervovaných dost vajec — zbývá místo jen na ${slot.cartonsLeft} ${
        slot.cartonsLeft === 1 ? "karton" : "kartonů"
      }.`,
    };
  }
  return { ok: true };
}
