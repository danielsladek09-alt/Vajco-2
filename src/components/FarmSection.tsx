import { ExternalLink, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { FarmMapLoader } from "./FarmMapLoader";
import { farm } from "@/config/site";

export function FarmSection() {
  const navUrl = `https://www.openstreetmap.org/?mlat=${farm.lat}&mlon=${farm.lng}#map=${farm.zoom}/${farm.lat}/${farm.lng}`;

  return (
    <section id="farma" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">Farma</p>
        <h2 className="font-display max-w-xl text-3xl text-forest sm:text-4xl">
          Tam, kde to všechno začíná.
        </h2>
        <p className="mt-3 max-w-lg text-forest/70 sm:text-lg">
          Vejce pochází z našeho chovu v {farm.village} u {farm.region}. Farma se
          nachází hned {farm.landmark}.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="h-80 overflow-hidden rounded-[2rem] border border-forest/10 sm:h-[420px]">
            <FarmMapLoader />
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] border border-forest/10 bg-white/60 p-6 sm:p-8">
            <div>
              <MapPin className="h-6 w-6 text-forest" strokeWidth={1.5} />
              <h3 className="font-display mt-3 text-xl text-forest">{farm.village}</h3>
              <p className="text-sm text-forest/60">{farm.region}</p>
              <p className="mt-4 text-sm text-forest/70">
                Místo, kde vznikají naše vejce — {farm.landmark}.
              </p>
              {farm.isApproximate && (
                <p className="mt-3 text-xs text-forest/40">
                  Poloha na mapě je zatím přibližná (střed obce). Přesné souřadnice
                  farmy doplníme.
                </p>
              )}
            </div>

            <a
              href={navUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-forest/20 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
            >
              Otevřít v mapách
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
