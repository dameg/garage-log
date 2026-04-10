-- DropForeignKey
ALTER TABLE "DocumentLog" DROP CONSTRAINT "DocumentLog_vehicleId_fkey";

-- AddForeignKey
ALTER TABLE "DocumentLog" ADD CONSTRAINT "DocumentLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
