import { env } from '../config';
import type { Deps } from './types';
import { getPrisma } from '../db/prisma';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';
import { createRedisClient } from '../redis/redis';
import { RedisService } from '../redis/redis.service';

let prodDeps: Deps | null = null;

export function createProdDeps(): Deps {
  if (prodDeps) {
    return prodDeps;
  }

  const prisma = getPrisma();

  const redisClient = createRedisClient(env.REDIS_URL ?? 'redis://localhost:6379');

  prodDeps = {
    redisService: new RedisService(redisClient),
    vehiclesRepo: new PrismaVehicleRepository(prisma),
    usersRepo: new PrismaUserRepository(prisma),
  };

  return prodDeps;
}
