import type { UpdateVehiclePatch } from '../../domain/vehicle';

export type UpdateVehicleInput = {
  vehicleId: string;
  ownerId: string;
  patch: UpdateVehiclePatch;
};
