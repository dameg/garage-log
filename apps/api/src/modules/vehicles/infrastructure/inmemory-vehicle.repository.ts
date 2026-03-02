import type { Vehicle } from "../domain/vehicle";
import type { VehicleRepository } from "../domain/vehicle.repository";

export class InMemoryVehicleRepository implements VehicleRepository {
  private data: Vehicle[] = [];

  async create(vehicle: Vehicle) {
    this.data.push(vehicle);
    return vehicle;
  }

  async findAll() {
    return [...this.data];
  }
}
