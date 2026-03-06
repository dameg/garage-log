import type { UpdatableVehicleFields, Vehicle } from '../domain/vehicle';
import type { VehicleRepository } from '../domain/vehicle.repository';

export class InMemoryVehicleRepository implements VehicleRepository {
  private data: Vehicle[] = [];

  async create(vehicle: Vehicle): Promise<Vehicle> {
    this.data.push(vehicle);
    return vehicle;
  }

  async findAll(): Promise<Vehicle[]> {
    return [...this.data];
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.data.find((vehicle) => vehicle.id === id) || null;
  }

  async deleteById(id: string): Promise<boolean> {
    const prevLength = this.data.length;

    this.data = this.data.filter((vehicle) => vehicle.id !== id);

    return this.data.length < prevLength;
  }

  async updateById(id: string, data: UpdatableVehicleFields): Promise<Vehicle | null> {
    const index = this.data.findIndex((vehicle) => vehicle.id === id);

    if (index === -1) {
      return null;
    }

    const updated: Vehicle = {
      ...this.data[index],
      ...data,
    };

    this.data[index] = updated;

    return updated;
  }
}
