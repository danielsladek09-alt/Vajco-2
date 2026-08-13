"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ReservationStatus } from "@prisma/client";
import { updateReservationStatus } from "@/actions/admin";
import { STATUS_LABELS, STATUS_ORDER, STATUS_BADGE_CLASSES } from "@/lib/reservation-status";

export function ReservationStatusSelect({
  id,
  status,
}: {
  id: string;
  status: ReservationStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as ReservationStatus;
        startTransition(async () => {
          await updateReservationStatus(id, next);
          router.refresh();
        });
      }}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-forest/30 disabled:opacity-50 ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
