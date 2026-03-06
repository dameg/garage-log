import type { VehicleRepository } from '../domain/vehicle.repository';

export class ListVehiclesUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute() {
    return this.repo.findAll();
  }
}
