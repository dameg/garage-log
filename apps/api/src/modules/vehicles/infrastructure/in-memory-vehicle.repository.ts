import type { UpdatableVehicleFields, Vehicle } from '../domain/vehicle';
import type { VehicleRepository } from '../domain/vehicle.repository';

export class InMemoryVehicleRepository implements VehicleRepository {
  private data: Vehicle[] = [];

  async create(vehicle: Vehicle): Promise<Vehicle> {
    this.data.push(vehicle);
    return vehicle;
  }

  async findAllByOwnerId(ownerId: string): Promise<Vehicle[]> {
    return this.data.filter((vehicle) => vehicle.ownerId === ownerId);
  }

  async findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    return this.data.find((vehicle) => vehicle.id === id && vehicle.ownerId === ownerId) || null;
  }

  async deleteByIdForOwner(id: string, ownerId: string): Promise<boolean> {
    const prevLength = this.data.length;

    this.data = this.data.filter((vehicle) => !(vehicle.id === id && vehicle.ownerId === ownerId));

    return this.data.length < prevLength;
  }

  async updateByIdForOwner(
    id: string,
    ownerId: string,
    data: UpdatableVehicleFields,
  ): Promise<Vehicle | null> {
    const index = this.data.findIndex(
      (vehicle) => vehicle.id === id && vehicle.ownerId === ownerId,
    );

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
