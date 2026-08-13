import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brown">Informace</p>
      <h1 className="font-display text-3xl text-forest sm:text-4xl">
        Ochrana osobních údajů
      </h1>
      <p className="mt-6 text-forest/70">
        Tahle stránka je zatím jen připravené místo — plné znění zásad
        zpracování osobních údajů (v souladu s GDPR) sem doplníme, jakmile
        bude hotové. V rezervačním formuláři sbíráme jméno, telefon a e-mail
        výhradně za účelem vyřízení tvé rezervace vajec.
      </p>
    </div>
  );
}
