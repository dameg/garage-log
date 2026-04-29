import type { PaginatedResult } from '../../../shared/contracts/paginated-result';
import type { UpdateVehiclePatch, Vehicle } from '../domain/vehicle';

import type { VehicleListQuery } from './vehicle-list.query';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  list(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>>;
  findByIdForOwner(vehicleId: string, ownerId: string): Promise<Vehicle | null>;
  deleteByIdForOwner(vehicleId: string, ownerId: string): Promise<boolean>;
  updateByIdForOwner(
    vehicleId: string,
    ownerId: string,
    patch: UpdateVehiclePatch,
  ): Promise<Vehicle | null>;
}
