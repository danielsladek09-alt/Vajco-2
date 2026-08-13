import { PrismaClient } from "@prisma/client";

/**
 * Sdílená Prisma instance. V dev módu ji ukládáme na `globalThis`, aby
 * Next.js hot-reload nevytvářel při každé změně nové a nové připojení
 * k databázi.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
