/*
  Warnings:

  - You are about to drop the column `name` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `vin` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "name",
ADD COLUMN     "vin" TEXT NOT NULL;
