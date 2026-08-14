/**
 * Čistá logika pro počítání dat a časových slotů — žádné volání do
 * databáze, takže je bezpečně použitelná i mimo server (a snadno
 * testovatelná bez DB). DB-závislé věci (dostupnost/kapacita) jsou v
 * `slots.ts`, které z tohoto souboru vychází.
 */

import { reservationConfig } from "@/config/reservations";

export const WEEKDAY_LABELS = ["ne", "po", "út", "st", "čt", "pá", "so"];

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function toDateString(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Rozloží zadaný okamžik (výchozí: teď) do lokálního data/času v Europe/Prague. */
export function localParts(instant: Date = new Date()) {
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

export function dateStringToWeekday(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
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
export function getLeadCutoff() {
  const cutoffInstant = new Date(Date.now() + reservationConfig.minLeadHours * 60 * 60 * 1000);
  return localParts(cutoffInstant);
}

/** Dnešní datum (Europe/Prague) jako "YYYY-MM-DD" — pro admin přehled a filtry. */
export function getTodayDateString(): string {
  return localParts().date;
}
