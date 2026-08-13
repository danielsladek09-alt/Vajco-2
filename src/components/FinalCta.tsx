import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
      <Reveal>
        <h2 className="font-display mx-auto max-w-2xl text-4xl text-forest sm:text-5xl">
          Kolik vajec ti máme schovat?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-forest/70 sm:text-lg">
          Vyber si karton, rezervuj čas a my je na tebe v Komíně počkáme.
        </p>
        <a
          href="#rezervace"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-base font-semibold text-cream transition-transform hover:scale-[1.03]"
        >
          Rezervovat vejce
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
}
