import { randomUUID } from 'node:crypto';

import type { VehicleRepository } from '../contracts/vehicle.repository';
import { createVehicle, type Vehicle } from '../domain/vehicle';

import type { CreateVehicleInput } from './dto/create-vehicle.dto';

export class CreateVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const vehicle = createVehicle({
      ...input,
      id: randomUUID(),
    });

    return this.repo.create(vehicle);
  }
}
