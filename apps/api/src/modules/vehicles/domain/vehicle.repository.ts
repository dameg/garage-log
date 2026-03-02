import type { Vehicle } from "./vehicle";

export const VEHICLE_REPOSITORY = Symbol("VEHICLE_REPOSITORY");

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findAll(): Promise<Vehicle[]>;
}
