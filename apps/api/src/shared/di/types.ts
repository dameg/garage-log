import type { VehicleRepository } from '../../modules/vehicles/domain/vehicle.repository';

export type Deps = {
  vehiclesRepo: VehicleRepository;
};
