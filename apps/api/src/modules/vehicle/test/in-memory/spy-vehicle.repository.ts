import type { PaginatedResult } from '../../../../shared/contracts';
import type { VehicleRepository } from '../../contracts/vehicle.repository';
import type { VehicleListQuery } from '../../contracts/vehicle-list.query';
import type { UpdateVehiclePatch, Vehicle } from '../../domain/vehicle';

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

  async findByIdForOwner(_id: string, _ownerId: string): Promise<Vehicle | null> {
    return null;
  }

  async deleteByIdForOwner(_id: string, _ownerId: string): Promise<boolean> {
    return false;
  }

  async updateByIdForOwner(
    _id: string,
    _ownerId: string,
    _patch: UpdateVehiclePatch,
  ): Promise<Vehicle | null> {
    return null;
  }

  async list(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>> {
    this.lastListQuery = query;
    return this.result;
  }
}
