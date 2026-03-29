import { NotFoundError } from '../../../shared/errors/not-found-error';
import { updateVehicle, type UpdatableVehicleFields, type Vehicle } from '../domain/vehicle';
import type { VehicleRepository } from '../domain/vehicle.repository';
import type { UpdateVehicleInput } from './dto/update-vehicle.dto';

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
