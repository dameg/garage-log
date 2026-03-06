import { UpdateVehiclePatch } from '../../domain/vehicle';

export type UpdateVehicleInput = {
  id: string;
  patch: UpdateVehiclePatch;
};
