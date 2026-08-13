import "server-only";
import crypto from "node:crypto";

/**
 * Velmi jednoduchá admin autentizace — jedno sdílené heslo
 * (`ADMIN_PASSWORD`) a podepsaná session cookie. Administrace VAJCO
 * nemá vlastní uživatele/role, takže tohle je záměrně jednoduché, ne
 * odfláknuté: cookie je httpOnly, podepsaná HMAC podpisem a má
 * platnost 8 hodin.
 */

export const ADMIN_COOKIE_NAME = "vajco_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hodin

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET není nastavený — doplň ho do .env (viz .env.example).",
    );
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
