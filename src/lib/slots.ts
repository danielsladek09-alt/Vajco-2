import "server-only";

import { reservationConfig } from "@/config/reservations";
import { prisma } from "@/lib/prisma";

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

const WEEKDAY_LABELS = ["ne", "po", "út", "st", "čt", "pá", "so"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toDateString(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Rozloží zadaný okamžik (výchozí: teď) do lokálního data/času v Europe/Prague. */
function localParts(instant: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: reservationConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = Number(get("hour")) % 24;
  const minutes = hour * 60 + Number(get("minute"));
  return { date, minutes };
}

function dateStringToWeekday(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/** Všechny teoretické časové sloty pro daný den podle konfigurace (bez ohledu na kapacitu). */
export function getSlotsForDate(date: string): string[] {
  const weekday = dateStringToWeekday(date);
  if (!reservationConfig.pickupDays.includes(weekday)) return [];

  const start = timeToMinutes(reservationConfig.windowStart);
  const end = timeToMinutes(reservationConfig.windowEnd);
  const slots: string[] = [];
  for (let m = start; m < end; m += reservationConfig.slotLengthMinutes) {
    slots.push(minutesToTime(m));
  }
  return slots;
}

/** Seznam rezervovatelných dat (jen dny výdeje v rámci `bookableDaysAhead`). */
export function listCandidateDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < reservationConfig.bookableDaysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = toDateString(d);
    if (reservationConfig.pickupDays.includes(d.getDay())) {
      dates.push(dateStr);
    }
  }
  return dates;
}

/** Nejzazší okamžik, do kterého ještě NENÍ možné rezervovat (teď + minLeadHours). */
function getLeadCutoff() {
  const cutoffInstant = new Date(Date.now() + reservationConfig.minLeadHours * 60 * 60 * 1000);
  return localParts(cutoffInstant);
}

/**
 * Vrátí dostupnost všech slotů pro daný den — kolik rezervací/kartonů se
 * ještě vejde, s ohledem na už uložené rezervace v databázi a na minimální
 * předstih rezervace.
 */
export async function getAvailableSlotsForDate(date: string): Promise<SlotOption[]> {
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

  const existing = await prisma.reservation.findMany({
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
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const slots = await getAvailableSlotsForDate(date);
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
