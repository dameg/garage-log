import type { Deps } from './types';
import { InMemoryUserRepository } from '../../modules/auth/infrastructure/in-memery-user.repository';
import { InMemoryVehicleRepository } from '../../modules/vehicles/infrastructure/in-memory-vehicle.repository';

export function createTestDeps(): Deps {
  return {
    vehiclesRepo: new InMemoryVehicleRepository(),
    usersRepo: new InMemoryUserRepository(),
  };
}
