/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `DocumentLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DocumentLog_vehicleId_ownerId_idx";

-- CreateIndex
CREATE INDEX "DocumentLog_vehicleId_ownerId_createdAt_id_idx" ON "DocumentLog"("vehicleId", "ownerId", "createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentLog_createdAt_id_key" ON "DocumentLog"("createdAt", "id");
