import { MapPin, Wallet } from "lucide-react";
import { Reveal } from "./Reveal";
import { pickup } from "@/config/site";

export function PickupSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="grid gap-10 rounded-[2rem] bg-forest px-6 py-12 text-cream sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">
              Vejce čekají v {pickup.district}.
            </h2>
            <p className="mt-4 max-w-lg text-cream/75 sm:text-lg">
              Vejce si rezervuješ online a vyzvedneš na výdejním místě v {pickup.city}
              -{pickup.district}. {pickup.addressNote}
            </p>

            <div className="mt-6 flex items-start gap-3 text-sm text-cream/70">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                Výdejní místo: {pickup.city} – {pickup.district}
              </span>
            </div>
            <div className="mt-2 flex items-start gap-3 text-sm text-cream/70">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{pickup.paymentNote}</span>
            </div>
          </div>

          <a
            href="#rezervace"
            className="inline-flex w-fit items-center justify-center rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-forest transition-transform hover:scale-[1.03] sm:text-base"
          >
            Rezervovat vejce
          </a>
        </div>
      </Reveal>
    </section>
  );
}
