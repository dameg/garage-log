import type { PaginatedResult } from '../../../../shared/domain/paginated-result';
import type { Vehicle } from '../../domain/vehicle';
import type { VehicleListQuery } from '../../domain/vehicle-list.query';
import type { VehicleRepository } from '../../domain/vehicle.repository';

export class SpyVehicleRepository implements VehicleRepository {
  public lastListQuery: VehicleListQuery | null = null;

  constructor(
    private readonly result: PaginatedResult<Vehicle> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
  ) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    return vehicle;
  }

  async findAllByOwnerId(ownerId: string): Promise<Vehicle[]> {
    return [];
  }

  async findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    return null;
  }

  async deleteByIdForOwner(id: string, ownerId: string): Promise<boolean> {
    return false;
  }

  async updateByIdForOwner(id: string, ownerId: string, patch: any): Promise<Vehicle | null> {
    return null;
  }

  async list(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>> {
    this.lastListQuery = query;
    return this.result;
  }
}
