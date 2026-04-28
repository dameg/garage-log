import type { Vehicle } from '@/entities/vehicle/model/vehicle.types';

import type { CreateVehicleInput } from '../../create-vehicle/model/create-vehicle.schema';

export type UpdateVehicleInput = {
  vehicleId: Vehicle['id'];
  payload: CreateVehicleInput;
};
