import { randomUUID } from "crypto";
import { createVehicle } from "../domain/vehicle";
import type { VehicleRepository } from "../domain/vehicle.repository";
import type { CreateVehicleInput } from "./dto/create-vehicle.dto";

export class CreateVehicleUseCase {
  constructor(private repo: VehicleRepository) {}

  async execute(input: CreateVehicleInput) {
    const vehicle = createVehicle({
      id: randomUUID(),
      ...input,
    });

    return this.repo.create(vehicle);
  }
}
