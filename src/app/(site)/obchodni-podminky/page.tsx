import type { Metadata } from "next";
import { pickup } from "@/config/site";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">Informace</p>
      <h1 className="font-display text-3xl text-forest sm:text-4xl">Obchodní podmínky</h1>
      <p className="mt-6 text-forest/70">
        Plné obchodní podmínky sem doplníme. Zatím jen stručně, jak rezervace
        u VAJCO funguje:
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-forest/70">
        <li>Rezervace přes web není závaznou objednávkou s platbou.</li>
        <li>{pickup.paymentNote}</li>
        <li>
          Vejce si vyzvedneš osobně na výdejním místě v {pickup.city} –{" "}
          {pickup.district}.
        </li>
      </ul>
    </div>
  );
}
