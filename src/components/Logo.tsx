import Image from "next/image";

/**
 * ⚠️ DOČASNÉ LOGO — TOHLE NENÍ FINÁLNÍ ZNAČKA VAJCO.
 *
 * Skutečné logo (černý obrys vejce se skriptovým nápisem "Vajco" a ®)
 * jsme dostali jako obrázek přímo v chatu, ne jako soubor, takže ho
 * nešlo uložit 1:1 do repozitáře beze změny. Aby zbytek webu nebyl
 * blokovaný, je tu jednoduchý, zjevně odlišný náhradní wordmark.
 *
 * JAK NAHRADIT SKUTEČNÝM LOGEM:
 * 1. Ulož skutečné soubory loga do `/public/logo/` (ideálně SVG, ať se
 *    nerozmazává; klidně přepiš tyto názvy souborů, ať to sedí):
 *      - vajco-wordmark.svg        (tmavá verze pro světlé pozadí)
 *      - vajco-wordmark-cream.svg  (světlá verze pro tmavé pozadí)
 *      - vajco-mark.svg            (jen ikona, bez textu — favicon apod.)
 * 2. Nic dalšího se měnit nemusí — tahle komponenta je jediné místo,
 *    odkud se logo v aplikaci používá, a zachovává poměr stran.
 */

type LogoVariant = "full" | "mark";
type LogoTone = "dark" | "cream";

interface LogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  priority?: boolean;
}

const SOURCES: Record<LogoVariant, Record<LogoTone, string>> = {
  full: {
    dark: "/logo/vajco-wordmark.svg",
    cream: "/logo/vajco-wordmark-cream.svg",
  },
  mark: {
    dark: "/logo/vajco-mark.svg",
    cream: "/logo/vajco-mark-cream.svg",
  },
};

const DIMENSIONS: Record<LogoVariant, { width: number; height: number }> = {
  full: { width: 260, height: 64 },
  mark: { width: 100, height: 128 },
};

export function Logo({ variant = "full", tone = "dark", className, priority }: LogoProps) {
  const src = SOURCES[variant][tone];
  const { width, height } = DIMENSIONS[variant];

  return (
    <Image
      src={src}
      alt="VAJCO"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
