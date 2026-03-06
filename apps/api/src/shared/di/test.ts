import type { Deps } from './types';
import { InMemoryVehicleRepository } from '../../modules/vehicles/infrastructure/in-memory-vehicle.repository';

export function createTestDeps(): Deps {
  return {
    vehiclesRepo: new InMemoryVehicleRepository(),
  };
}
