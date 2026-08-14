import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTodayDateString } from "@/lib/slots";
import { ReservationStatusSelect } from "@/components/ReservationStatusSelect";
import { products } from "@/config/site";

const PRODUCT_LABELS: Record<string, string> = Object.fromEntries(
  products.items.map((p) => [p.id === "carton-12" ? "CARTON_12" : "CARTON_30", p.shortLabel]),
);

async function getStats(date: string) {
  const [today, total] = await Promise.all([
    prisma.reservation.aggregate({
      where: { pickupDate: date, status: { not: "CANCELLED" } },
      _count: true,
      _sum: { cartonCount: true, eggCount: true },
    }),
    prisma.reservation.aggregate({
      where: { status: { not: "CANCELLED" } },
      _count: true,
      _sum: { eggCount: true },
    }),
  ]);

  return {
    today: {
      reservations: today._count,
      cartons: today._sum.cartonCount ?? 0,
      eggs: today._sum.eggCount ?? 0,
    },
    total: {
      reservations: total._count,
      eggs: total._sum.eggCount ?? 0,
    },
  };
}

export default async function AdminDashboardPage({
  searchParams,
}: PageProps<"/admin">) {
  const params = await searchParams;
  const dateParam = typeof params.date === "string" ? params.date : undefined;
  const isValidDate = dateParam ? /^\d{4}-\d{2}-\d{2}$/.test(dateParam) : false;
  const filterDate = isValidDate ? dateParam : undefined;

  const today = getTodayDateString();
  const stats = await getStats(today);

  const reservations = await prisma.reservation.findMany({
    where: filterDate ? { pickupDate: filterDate } : undefined,
    orderBy: [{ pickupDate: "asc" }, { pickupTime: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl text-forest">Rezervace</h1>
        <p className="text-sm text-forest/50">Přehled a správa rezervací vajec.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title={`Dnes (${today})`}
          items={[
            { label: "Rezervací", value: stats.today.reservations },
            { label: "Kartonů", value: stats.today.cartons },
            { label: "Vajec", value: stats.today.eggs },
          ]}
        />
        <StatCard
          title="Celkem (bez zrušených)"
          items={[
            { label: "Rezervací", value: stats.total.reservations },
            { label: "Vajec", value: stats.total.eggs },
          ]}
        />
      </div>

      <div className="rounded-2xl border border-forest/10 bg-white/60 p-5">
        <form className="flex flex-wrap items-end gap-3" method="GET">
          <div>
            <label htmlFor="date" className="mb-1 block text-xs font-medium text-forest/60">
              Filtrovat podle data vyzvednutí
            </label>
            <input
              id="date"
              name="date"
              type="date"
              defaultValue={filterDate ?? today}
              className="rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm text-forest focus:border-forest focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream"
          >
            Filtrovat
          </button>
          {filterDate && (
            <Link
              href="/admin"
              className="text-sm font-medium text-forest/60 underline underline-offset-4 hover:text-forest"
            >
              Zobrazit vše
            </Link>
          )}
          <a
            href={`/admin/export${filterDate ? `?date=${filterDate}` : ""}`}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white/60">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest/45">
              <th className="px-4 py-3 font-medium">Jméno</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Datum</th>
              <th className="px-4 py-3 font-medium">Čas</th>
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Kartonů</th>
              <th className="px-4 py-3 font-medium">Vajec</th>
              <th className="px-4 py-3 font-medium">Stav</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-forest/40">
                  Žádné rezervace {filterDate ? "pro vybrané datum" : "zatím"}.
                </td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-forest/5 last:border-0">
                <td className="px-4 py-3 font-medium text-forest">{r.name}</td>
                <td className="px-4 py-3 text-forest/70">
                  <div>{r.phone}</div>
                  <div className="text-xs text-forest/45">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-forest/70">{r.pickupDate}</td>
                <td className="px-4 py-3 text-forest/70">{r.pickupTime}</td>
                <td className="px-4 py-3 text-forest/70">
                  {PRODUCT_LABELS[r.product] ?? r.product}
                </td>
                <td className="px-4 py-3 text-forest/70">{r.cartonCount}</td>
                <td className="px-4 py-3 text-forest/70">{r.eggCount}</td>
                <td className="px-4 py-3">
                  <ReservationStatusSelect id={r.id} status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reservations.length === 200 && (
        <p className="text-xs text-forest/40">
          Zobrazeno prvních 200 záznamů — pro delší historii použij filtr podle data.
        </p>
      )}
    </div>
  );
}

function StatCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brown">{title}</p>
      <div className="mt-4 flex gap-8">
        {items.map((item) => (
          <div key={item.label}>
            <p className="font-display text-3xl text-forest">{item.value}</p>
            <p className="text-xs text-forest/50">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
