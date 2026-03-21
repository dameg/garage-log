import type { VehicleRepository } from '../domain/vehicle.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { Vehicle } from '../domain/vehicle';
export class GetVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ id, ownerId }: { id: string; ownerId: string }): Promise<Vehicle> {
    const vehicle = await this.repo.findByIdForOwner(id, ownerId);
    if (!vehicle) {
      throw new NotFoundError('Vehicle', id);
    }
    return vehicle;
  }
}
