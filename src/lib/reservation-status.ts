import type { ReservationStatus } from "@prisma/client";

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  NEW: "Nová",
  CONFIRMED: "Potvrzená",
  PICKED_UP: "Vyzvednuto",
  CANCELLED: "Zrušená",
};

export const STATUS_ORDER: ReservationStatus[] = [
  "NEW",
  "CONFIRMED",
  "PICKED_UP",
  "CANCELLED",
];

export const STATUS_BADGE_CLASSES: Record<ReservationStatus, string> = {
  NEW: "bg-brown/15 text-brown",
  CONFIRMED: "bg-grass/20 text-forest",
  PICKED_UP: "bg-forest/15 text-forest",
  CANCELLED: "bg-red-100 text-red-700",
};
