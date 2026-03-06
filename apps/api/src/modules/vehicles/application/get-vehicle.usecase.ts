import { VehicleRepository } from '../domain/vehicle.repository';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import { Vehicle } from '../domain/vehicle';
export class GetVehicleUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ id }: { id: string }): Promise<Vehicle> {
    const vehicle = await this.repo.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle', id);
    }
    return vehicle;
  }
}
