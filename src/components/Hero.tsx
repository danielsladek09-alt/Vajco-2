"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

/**
 * Zvažované varianty headline (zadání #10):
 *   - "Vejce, co mají příběh."
 *   - "Čerstvé vejce. Přímo od nás."
 *   - "Od slepice až k tobě."   ← vybráno, viz níže
 *
 * "Od slepice až k tobě." vyhrálo, protože v pěti slovech popisuje
 * celou cestu (farma → rezervace → vyzvednutí), zní lidsky a hraje si
 * s pohybem v hero grafice.
 */
export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-grass-light/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-cream-dark/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-forest/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-forest/70"
          >
            Farma u Klentnice · Pálava
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[13vw] leading-[0.95] tracking-tight text-forest sm:text-6xl lg:text-7xl"
          >
            Od slepice
            <br />
            až k tobě.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-md text-base text-forest/70 sm:text-lg"
          >
            Čerstvá vejce z vlastního chovu u Pálavy. Vyber si karton, zarezervuj
            čas a vyzvedni si je v Brně-Komíně. Platíš až na místě.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#rezervace"
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] sm:text-base"
            >
              Rezervovat vejce
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#o-nas"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 transition-colors hover:decoration-forest sm:text-base"
            >
              Poznat VAJCO
            </a>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="col-span-2"
          >
            <PhotoPlaceholder
              caption="Fotka: slepice ve volném výběhu na farmě v Klentnici"
              tone="grass"
              className="aspect-[4/3]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            whileHover={{ y: -4 }}
          >
            <PhotoPlaceholder
              caption="Fotka: čerstvá vejce v ruce"
              tone="cream"
              className="aspect-square"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            whileHover={{ y: -4 }}
          >
            <PhotoPlaceholder
              caption="Fotka: karton vajec v trávě"
              tone="forest"
              className="aspect-square"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
