import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Místo pro budoucí fotografii. Zadání výslovně zakazuje používat
 * neověřené stock fotky bez licence — dokud nemáme vlastní snímky,
 * web ukazuje jasně označené místo, kam se později fotka vloží
 * (`caption` popisuje, co by na ní mělo být).
 */
export function PhotoPlaceholder({
  caption,
  className,
  tone = "grass",
}: {
  caption: string;
  className?: string;
  tone?: "grass" | "cream" | "forest";
}) {
  const toneClasses = {
    grass: "from-grass-light/40 via-cream-dark/60 to-grass/30",
    cream: "from-cream-dark/70 via-cream/50 to-grass-light/30",
    forest: "from-forest-light/30 via-forest/20 to-cream-dark/40",
  } as const;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[2rem] border border-forest/10 bg-gradient-to-br p-8 text-center",
        toneClasses[tone],
        className,
      )}
    >
      <div className="grain absolute inset-0" />
      <Camera className="h-7 w-7 text-forest/40" strokeWidth={1.5} />
      <p className="max-w-[16rem] text-xs font-medium text-forest/50">{caption}</p>
    </div>
  );
}
