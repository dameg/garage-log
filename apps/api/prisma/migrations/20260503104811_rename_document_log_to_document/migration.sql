/*
  Warnings:

  - You are about to drop the `DocumentLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('insurance', 'inspection');

-- DropForeignKey
ALTER TABLE "DocumentLog" DROP CONSTRAINT "DocumentLog_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentLog" DROP CONSTRAINT "DocumentLog_vehicleId_fkey";

-- DropTable
DROP TABLE "DocumentLog";

-- DropEnum
DROP TYPE "DocumentLogType";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_vehicleId_ownerId_createdAt_id_idx" ON "Document"("vehicleId", "ownerId", "createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_createdAt_id_key" ON "Document"("createdAt", "id");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
