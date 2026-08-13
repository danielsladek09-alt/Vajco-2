import "server-only";

/**
 * Jednoduchý in-memory rate limiter proti spamu v rezervačním formuláři.
 *
 * Pro jeden serverless/edge běh je in-memory mapa dostačující — VAJCO
 * v tuto chvíli neočekává provoz, kde by to bylo úzké hrdlo. Pokud web
 * poběží na více instancích současně (více serverless funkcí najednou),
 * limit se bude počítat per-instance. Pro striktní globální limit by bylo
 * potřeba sdílené úložiště (např. Redis / Upstash) — zapojení by šlo
 * jen tady, zbytek appky by se nemusel měnit.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minut
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Průběžný úklid, ať mapa neroste do nekonečna.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
    }
  }

  return false;
}
