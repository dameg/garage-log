import { randomUUID } from 'node:crypto';
import type { VehicleRepository } from '../contracts/vehicle.repository';
import { createVehicle, type Vehicle } from '../domain/vehicle';
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
