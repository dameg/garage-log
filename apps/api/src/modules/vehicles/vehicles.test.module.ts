import { Module } from "@nestjs/common";
import { VehiclesController } from "./presentation/vehicles.controller";
import { VEHICLE_REPOSITORY } from "./domain/vehicle.repository";
import { InMemoryVehicleRepository } from "./infrastructure/inmemory-vehicle.repository";

@Module({
  controllers: [VehiclesController],
  providers: [
    { provide: VEHICLE_REPOSITORY, useClass: InMemoryVehicleRepository },
  ],
})
export class VehiclesTestModule {}
