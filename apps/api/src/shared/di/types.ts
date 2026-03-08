import { UserRepository } from '../../modules/auth/domain/user.repository';
import type { VehicleRepository } from '../../modules/vehicles/domain/vehicle.repository';

export type Deps = {
  usersRepo: UserRepository;
  vehiclesRepo: VehicleRepository;
};
