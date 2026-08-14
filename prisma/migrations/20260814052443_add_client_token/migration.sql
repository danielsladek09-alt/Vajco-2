/*
  Warnings:

  - Added the required column `clientToken` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "cartonCount" INTEGER NOT NULL,
    "eggCount" INTEGER NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "note" TEXT,
    "clientToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "consentAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Reservation" ("cartonCount", "consentAt", "createdAt", "eggCount", "email", "id", "name", "note", "phone", "pickupDate", "pickupTime", "product", "status", "updatedAt") SELECT "cartonCount", "consentAt", "createdAt", "eggCount", "email", "id", "name", "note", "phone", "pickupDate", "pickupTime", "product", "status", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_clientToken_key" ON "Reservation"("clientToken");
CREATE INDEX "Reservation_pickupDate_idx" ON "Reservation"("pickupDate");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
