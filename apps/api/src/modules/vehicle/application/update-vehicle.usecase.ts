import type { VehicleRepository } from '../contracts/vehicle.repository';
import { type UpdatableVehicleFields, updateVehicle, type Vehicle } from '../domain/vehicle';

import type { UpdateVehicleInput } from './dto/update-vehicle.dto';

import { NotFoundError } from '@/shared/errors';

function toUpdatableFields(vehicle: Vehicle): UpdatableVehicleFields {
  return {
    vin: vehicle.vin,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
  };
}

export class UpdateVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: UpdateVehicleInput): Promise<Vehicle> {
    const existing = await this.repo.findByIdForOwner(input.vehicleId, input.ownerId);

    if (!existing) {
      throw new NotFoundError('Vehicle', input.vehicleId);
    }

    const next = updateVehicle(existing, input.patch);

    const updated = await this.repo.updateByIdForOwner(
      input.vehicleId,
      input.ownerId,
      toUpdatableFields(next),
    );

    if (!updated) {
      throw new NotFoundError('Vehicle', input.vehicleId);
    }

    return updated;
  }
}
