import { Egg, Heart, MapPin, CalendarCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const reasons = [
  {
    icon: Egg,
    title: "Čerstvější to jde těžko.",
    text: "Vejce pochází z našeho vlastního chovu. Žádný anonymní supermarket — víš přesně, odkud tvoje vejce jsou.",
  },
  {
    icon: Heart,
    title: "Kupuješ víc než vejce.",
    text: "Koupí podporuješ náš sen. Jsme dva kamarádi, kteří chtějí z malé myšlenky vybudovat velkou českou značku.",
  },
  {
    icon: CalendarCheck,
    title: "Jednoduše si je rezervuješ.",
    text: "Vybereš si termín, přijedeš do Brna-Komína a vejce si vyzvedneš. Platíš až na místě.",
  },
  {
    icon: MapPin,
    title: "Přímo z Pálavy.",
    text: "Farma je v Klentnici, kousek od Café Fara. Slepice mají volný výběh a podestýlku, ne klec.",
  },
];

export function WhyVajco() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">
          Proč VAJCO?
        </p>
        <h2 className="font-display max-w-xl text-3xl text-forest sm:text-4xl">
          Kupuješ vejce. Podporuješ náš sen.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl border border-forest/10 bg-white/60 p-6 sm:p-8">
              <reason.icon className="h-7 w-7 text-forest" strokeWidth={1.5} />
              <h3 className="font-display mt-4 text-xl text-forest">{reason.title}</h3>
              <p className="mt-2 text-sm text-forest/70 sm:text-base">{reason.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
