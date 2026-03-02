import { Module } from "@nestjs/common";
import { VehiclesController } from "./presentation/vehicles.controller";
import { VEHICLE_REPOSITORY } from "./domain/vehicle.repository";
import { PrismaService } from "../../shared/db/prisma.service";
import { PrismaVehicleRepository } from "./infrastructure/prisma-vehicle.repository";

@Module({
  controllers: [VehiclesController],
  providers: [
    PrismaService,
    {
      provide: VEHICLE_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaVehicleRepository(prisma),
      inject: [PrismaService],
    },
  ],
})
export class VehiclesModule {}
