import { NotFoundError } from '../../../shared/errors/not-found-error';
import { updateVehicle, type UpdatableVehicleFields, type Vehicle } from '../domain/vehicle';
import type { VehicleRepository } from '../domain/vehicle.repository';
import { UpdateVehicleInput } from './dto/update-vehicle.dto';

function toUpdatableFields(vehicle: Vehicle): UpdatableVehicleFields {
  return {
    name: vehicle.name,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
  };
}

export class UpdateVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: UpdateVehicleInput): Promise<Vehicle> {
    const existing = await this.repo.findByIdForOwner(input.id, input.ownerId);

    if (!existing) {
      throw new NotFoundError('Vehicle', input.id);
    }

    const next = updateVehicle(existing, input.patch);

    const updated = await this.repo.updateByIdForOwner(
      input.id,
      input.ownerId,
      toUpdatableFields(next),
    );

    if (!updated) {
      throw new NotFoundError('Vehicle', input.id);
    }

    return updated;
  }
}
