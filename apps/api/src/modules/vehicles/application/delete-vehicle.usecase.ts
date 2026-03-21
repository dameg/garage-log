import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { VehicleRepository } from '../domain/vehicle.repository';

export class DeleteVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ id, ownerId }: { id: string; ownerId: string }): Promise<void> {
    const deleted = await this.repo.deleteByIdForOwner(id, ownerId);

    if (!deleted) {
      throw new NotFoundError('Vehicle', id);
    }
  }
}
