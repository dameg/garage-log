import type { VehicleRepository } from '../domain/vehicle.repository';

export class ListVehiclesUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute({ ownerId }: { ownerId: string }) {
    return this.repo.findAllByOwnerId(ownerId);
  }
}
