/**
 * VAJCO — centrální konfigurace značky a obchodu.
 *
 * Toto je JEDINÉ místo, kde se mění ceny, produkty, kontakty, výdejní
 * místo a souřadnice farmy. Nic z toho by nemělo být napevno zapsané
 * v komponentách — vždy importuj hodnoty odsud.
 */

export const siteConfig = {
  name: "VAJCO",
  domain: "www.vajco.cz",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vajco.cz",
  tagline: "Čerstvá vejce. Velký sen.",
  description:
    "Čerstvá vejce z volného chovu přímo z farmy u Klentnice na Pálavě. Zarezervuj si karton a vyzvedni si ho v Brně-Komíně.",

  founders: {
    count: 2,
    ages: [17, 15] as const,
  },
} as const;

/**
 * Označení chovu / certifikace.
 *
 * DŮLEŽITÉ: Tady se NIC nevymýšlí. `label` je jediný text, který se
 * na webu zobrazuje jako oficiální označení produktu — dokud nedáme
 * přesné znění (např. skutečné číslo/typ chovu dle vajíčkového kódu),
 * nechává se obecné a pravdivé podle zadání.
 *
 * Pokud budeme mít nárok používat označení „BIO“, stačí přepsat
 * `isBio` na `true` a doplnit `bioCertificateNote` — nikde jinde se
 * nic měnit nemusí.
 */
export const certification = {
  label: "Vejce z volného chovu / volného výběhu",
  housingNote: "Slepice chované na podestýlce.",
  isBio: false,
  bioCertificateNote: null as string | null,
} as const;

/** Produkty — karton 12 a karton 30 vajec. */
export const products = {
  pricePerEgg: 8.9, // Kč / vejce — jediné místo, kde se mění cena vajec
  currency: "Kč",
  items: [
    {
      id: "carton-12" as const,
      eggCount: 12,
      label: "Karton 12 vajec",
      shortLabel: "12 vajec",
      description: "12 čerstvých vajec — akorát na týden k snídani.",
    },
    {
      id: "carton-30" as const,
      eggCount: 30,
      label: "Karton 30 vajec",
      shortLabel: "30 vajec",
      description: "Pro větší hlad nebo větší rodinu.",
    },
  ],
} as const;

export type ProductId = (typeof products.items)[number]["id"];

export function getProduct(id: ProductId) {
  const product = products.items.find((item) => item.id === id);
  if (!product) throw new Error(`Neznámý produkt: ${id}`);
  return product;
}

export function formatPrice(amountKc: number) {
  return `${amountKc.toLocaleString("cs-CZ", {
    minimumFractionDigits: amountKc % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${products.currency}`;
}

export function getProductPrice(id: ProductId) {
  const product = getProduct(id);
  return Math.round(product.eggCount * products.pricePerEgg * 100) / 100;
}

/**
 * Výdejní místo. Ulici a telefon zatím záměrně NEVYPLŇUJEME —
 * doplní se, až bude výdejní místo definitivní. Do té doby web
 * ukazuje `addressNote` místo smyšlené adresy.
 */
export const pickup = {
  city: "Brno",
  district: "Komín",
  addressLine: null as string | null, // TODO: doplnit přesnou adresu výdejního místa
  addressNote: "Přesnou adresu výdejního místa ti po rezervaci zobrazíme.",
  paymentNote: "Platba proběhne až při převzetí — online nic neplatíš.",
} as const;

/**
 * Farma — přibližná poloha u Klentnice na Pálavě, vedle Café Fara.
 *
 * Souřadnice níže jsou PŘIBLIŽNÉ (střed obce Klentnice) — nejde o
 * přesnou polohu farmy na pár metrů. Až budeme mít přesné GPS farmy,
 * stačí přepsat `lat`/`lng` a `isApproximate: false`.
 */
export const farm = {
  village: "Klentnice",
  region: "Pálava",
  landmark: "vedle Café Fara",
  lat: Number(process.env.NEXT_PUBLIC_FARM_LAT ?? 48.8443),
  lng: Number(process.env.NEXT_PUBLIC_FARM_LNG ?? 16.6539),
  isApproximate: process.env.NEXT_PUBLIC_FARM_EXACT !== "true",
  zoom: 14,
} as const;

/**
 * Kontakty a sociální sítě — vědomě prázdné placeholdery.
 * Nevymýšlet telefon/e-mail/IG/FB, dokud je nemáme skutečné.
 */
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
} as const;

export const nav = [
  { href: "#nase-vejce", label: "Naše vejce" },
  { href: "#o-nas", label: "O nás" },
  { href: "#farma", label: "Farma" },
  { href: "#rezervace", label: "Rezervace" },
] as const;
