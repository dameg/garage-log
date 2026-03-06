import type { UpdateVehiclePatch, Vehicle } from './vehicle';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  deleteById(id: string): Promise<boolean>;
  updateById(id: string, patch: UpdateVehiclePatch): Promise<Vehicle | null>;
}
