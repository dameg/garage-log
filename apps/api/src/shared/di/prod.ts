import { env } from '../config';
import type { Deps } from './types';
import { getPrisma } from '../db/prisma';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';
import { createRedisClient } from '../redis/redis';
import { RedisService } from '../redis/redis.service';

import { RedisTokenBucketRepository } from '../rate-limit/infrastructure/redis/redis-token-bucket.repository';
import { RedisSlidingWindowRepository } from '../rate-limit/infrastructure/redis/redis-sliding-window.repository';
import { ConsumeTokenBucketUseCase } from '../rate-limit/application/consume-token-bucket.usecase';
import { CheckSlidingWindowUseCase } from '../rate-limit/application/check-sliding-window.usecase';
import { PrismaDocumentLogRepository } from '../../modules/documents-log/infrastructure/prisma/prisma-document-log.repository';

let prodDeps: Deps | null = null;

export function createProdDeps(): Deps {
  if (prodDeps) {
    return prodDeps;
  }

  const prisma = getPrisma();

  const redisClient = createRedisClient(env.REDIS_URL ?? 'redis://localhost:6379');

  const redisService = new RedisService(redisClient);

  const tokenBucketRepository = new RedisTokenBucketRepository(redisService);
  const slidingWindowRepository = new RedisSlidingWindowRepository(redisService);

  prodDeps = {
    redisService,
    vehiclesRepo: new PrismaVehicleRepository(prisma),
    usersRepo: new PrismaUserRepository(prisma),
    documentLogsRepo: new PrismaDocumentLogRepository(prisma),
    consumeTokenBucketUseCase: new ConsumeTokenBucketUseCase(tokenBucketRepository),
    checkSlidingWindowUseCase: new CheckSlidingWindowUseCase(slidingWindowRepository),
  };

  return prodDeps;
}
