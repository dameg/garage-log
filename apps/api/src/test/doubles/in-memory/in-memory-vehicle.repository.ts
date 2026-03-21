import type { VehicleRepository } from '../../../modules/vehicles/domain/vehicle.repository';
import type { UpdatableVehicleFields, Vehicle } from '../../../modules/vehicles/domain/vehicle';
import type { VehicleListQuery } from '../../../modules/vehicles/domain/vehicle-list.query';
import type { PaginatedResult } from '../../../shared/domain/paginated-result';
import { matchesVehicleFilters } from './matches-vehicle-filters';
import { sortVehicles } from './sort-vehicles';

export class InMemoryVehicleRepository implements VehicleRepository {
  private data: Vehicle[] = [];

  async create(vehicle: Vehicle): Promise<Vehicle> {
    this.data.push(vehicle);
    return vehicle;
  }

  async findManyByOwner(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>> {
    const filtered = this.data.filter((vehicle) => matchesVehicleFilters(vehicle, query));

    const sorted = sortVehicles(filtered, query);

    const total = sorted.length;
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;

    return {
      data: sorted.slice(start, end),
      total,
      page: query.page,
      limit: query.limit,
    };
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
