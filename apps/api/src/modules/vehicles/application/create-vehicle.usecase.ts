import { randomUUID } from 'node:crypto';
import { createVehicle, Vehicle } from '../domain/vehicle';
import type { VehicleRepository } from '../domain/vehicle.repository';
import type { CreateVehicleInput } from './dto/create-vehicle.dto';

export class CreateVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const vehicle = createVehicle({
      id: randomUUID(),
      ...input,
    });

    return this.repo.create(vehicle);
  }
}
