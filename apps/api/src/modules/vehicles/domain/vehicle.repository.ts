import type { UpdateVehiclePatch, Vehicle } from './vehicle';
import type { VehicleListQuery } from './vehicle-list.query';
import type { PaginatedResult } from '../../../shared/domain/paginated-result';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  list(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>>;
  findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null>;
  deleteByIdForOwner(id: string, ownerId: string): Promise<boolean>;
  updateByIdForOwner(
    id: string,
    ownerId: string,
    patch: UpdateVehiclePatch,
  ): Promise<Vehicle | null>;
}
