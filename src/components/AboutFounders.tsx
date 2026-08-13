import { Reveal } from "./Reveal";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { siteConfig } from "@/config/site";

export function AboutFounders() {
  const [ageA, ageB] = siteConfig.founders.ages;

  return (
    <section id="o-nas" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <PhotoPlaceholder
            caption="Fotka: oba zakladatelé VAJCO na farmě"
            tone="forest"
            className="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">
            O nás
          </p>
          <h2 className="font-display text-3xl text-forest sm:text-4xl">
            Jsme dva kamarádi.
            <br />A máme jeden velký sen.
          </h2>

          <div className="mt-6 space-y-4 text-forest/75 sm:text-lg">
            <p>
              VAJCO vzniklo z jednoduchého nápadu. Chtěli jsme dostat čerstvá a chutná
              vejce k lidem domů a udělat jim úsměv už po prvním ochutnání.
            </p>
            <p>
              Je nám {ageA} a {ageB}. A místo toho, abychom jen mluvili o tom, co jednou
              chceme dělat, jsme se rozhodli začít.
            </p>
            <p>
              Naším cílem je postupně vybudovat nejznámější firmu na prodej vajec v
              Česku. Každým nákupem nám pomáháš tenhle sen posunout zase o kousek dál —
              a odnášíš si od nás něco jednoduchého, přírodního a hlavně dobrého.
            </p>
          </div>

          <p className="font-display mt-8 text-xl italic text-forest/80">
            „Dvě hlavy. Spousta vajec. Jeden sen.“
          </p>
        </Reveal>
      </div>
    </section>
  );
}
