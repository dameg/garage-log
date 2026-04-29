import type { CreateVehicleInput } from '../../create-vehicle/model/create-vehicle.schema';

export type UpdateVehicleInput = {
  vehicleId: string;
  payload: CreateVehicleInput;
};
