"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { products, formatPrice, getProductPrice, type ProductId } from "@/config/site";

function selectProduct(productId: ProductId) {
  window.dispatchEvent(new CustomEvent("vajco:select-product", { detail: productId }));
}

export function Products() {
  return (
    <section id="nase-vejce" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">
          Naše vejce
        </p>
        <h2 className="font-display max-w-xl text-3xl text-forest sm:text-4xl">
          Kolik vajec budeš chtít?
        </h2>
        <p className="mt-3 max-w-md text-forest/70">
          {formatPrice(products.pricePerEgg)} / vejce. Bez skrytých poplatků, bez předplatného.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {products.items.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-forest/10 bg-white/60">
              <PhotoPlaceholder
                caption={`Fotka: ${product.label.toLowerCase()}`}
                tone={i === 0 ? "cream" : "grass"}
                className="aspect-[16/10] rounded-none border-0"
              />
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-2xl text-forest">{product.shortLabel}</h3>
                <p className="mt-2 text-sm text-forest/70 sm:text-base">{product.description}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-forest">
                    {formatPrice(getProductPrice(product.id))}
                  </span>
                  <span className="text-sm text-forest/50">
                    ({formatPrice(products.pricePerEgg)} / vejce)
                  </span>
                </div>

                <a
                  href="#rezervace"
                  onClick={() => selectProduct(product.id)}
                  className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
                >
                  Rezervovat {product.eggCount}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
