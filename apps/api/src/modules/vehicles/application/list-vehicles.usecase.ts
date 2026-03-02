import type { VehicleRepository } from "../domain/vehicle.repository";

export class ListVehiclesUseCase {
  constructor(private repo: VehicleRepository) {}
  execute() {
    return this.repo.findAll();
  }
}
