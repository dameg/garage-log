import type { VehicleRepository } from '../contracts/vehicle.repository';
import type { Vehicle } from '../domain/vehicle';

import { NotFoundError } from '@/shared/errors';
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
