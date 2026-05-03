import { NotFoundError } from '../../../shared/errors';
import type { VehicleRepository } from '../contracts/vehicle.repository';

export class DeleteVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ vehicleId, ownerId }: { vehicleId: string; ownerId: string }): Promise<void> {
    const deleted = await this.repo.deleteByIdForOwner(vehicleId, ownerId);

    if (!deleted) {
      throw new NotFoundError('Vehicle', vehicleId);
    }
  }
}
