import { Reveal } from "./Reveal";
import { ReservationForm } from "./ReservationForm";
import { getPickupDateOptions } from "@/lib/slots";

export async function ReservationSection() {
  const dateOptions = await getPickupDateOptions();

  return (
    <section id="rezervace" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">
          Rezervace
        </p>
        <h2 className="font-display max-w-xl text-3xl text-forest sm:text-4xl">
          Rezervuj si svoje vejce.
        </h2>
        <p className="mt-3 max-w-lg text-forest/70 sm:text-lg">
          Vyber si, kolik jich chceš, a zarezervuj si čas vyzvednutí. Zaplatíš až
          při převzetí.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <ReservationForm initialDateOptions={dateOptions} />
      </Reveal>
    </section>
  );
}
