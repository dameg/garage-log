import { UpdateVehiclePatch } from '../../domain/vehicle';

export type UpdateVehicleInput = {
  id: string;
  ownerId: string;
  patch: UpdateVehiclePatch;
};
