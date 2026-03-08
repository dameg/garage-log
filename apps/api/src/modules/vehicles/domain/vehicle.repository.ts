import type { UpdateVehiclePatch, Vehicle } from './vehicle';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findAllByOwnerId(ownerId: string): Promise<Vehicle[]>;
  findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null>;
  deleteByIdForOwner(id: string, ownerId: string): Promise<boolean>;
  updateByIdForOwner(
    id: string,
    ownerId: string,
    patch: UpdateVehiclePatch,
  ): Promise<Vehicle | null>;
}
