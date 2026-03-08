import type { Deps } from './types';
import { getPrisma } from '../db/prisma';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';

let prodDeps: Deps | null = null;

export function createProdDeps(): Deps {
  if (prodDeps) {
    return prodDeps;
  }

  const prisma = getPrisma();

  prodDeps = {
    vehiclesRepo: new PrismaVehicleRepository(prisma),
    usersRepo: new PrismaUserRepository(prisma),
  };

  return prodDeps;
}
