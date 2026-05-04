import type { VehicleCacheInvalidator } from '../../cache/vehicle-cache-invalidator';
import type { createVehicleServices } from '../../vehicle.services';

export type VehicleRoutesOptions = {
  services: ReturnType<typeof createVehicleServices>;
  cacheInvalidator: VehicleCacheInvalidator;
};
