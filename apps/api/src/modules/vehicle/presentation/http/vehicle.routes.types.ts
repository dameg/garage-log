import type { createVehicleServices } from '../../vehicle.services';

export type VehicleRoutesOptions = {
  services: ReturnType<typeof createVehicleServices>;
};
