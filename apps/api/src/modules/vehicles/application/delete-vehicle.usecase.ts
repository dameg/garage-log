import { NotFoundError } from '../../../shared/errors/not-found-error';
import { VehicleRepository } from '../domain/vehicle.repository';

export class DeleteVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    const deleted = await this.repo.deleteById(id);

    if (!deleted) {
      throw new NotFoundError('Vehicle', id);
    }
  }
}
