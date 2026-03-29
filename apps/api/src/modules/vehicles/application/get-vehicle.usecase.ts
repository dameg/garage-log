import type { VehicleRepository } from '../domain/vehicle.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { Vehicle } from '../domain/vehicle';
export class GetVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ vehicleId, ownerId }: { vehicleId: string; ownerId: string }): Promise<Vehicle> {
    const vehicle = await this.repo.findByIdForOwner(vehicleId, ownerId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle', vehicleId);
    }
    return vehicle;
  }
}
