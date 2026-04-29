import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';
import { PrismaDocumentLogRepository } from '../../modules/documents-log/infrastructure/prisma/prisma-document-log.repository';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import { env } from '../config';
import { getPrisma } from '../db/prisma';
import { CheckSlidingWindowUseCase } from '../rate-limit/application/check-sliding-window.usecase';
import { ConsumeTokenBucketUseCase } from '../rate-limit/application/consume-token-bucket.usecase';
import { RedisSlidingWindowRepository } from '../rate-limit/infrastructure/redis/redis-sliding-window.repository';
import { RedisTokenBucketRepository } from '../rate-limit/infrastructure/redis/redis-token-bucket.repository';
import { createRedisClient } from '../redis/redis';
import { RedisService } from '../redis/redis.service';

import type { AppContainer } from './types';

let prodDeps: AppContainer | null = null;

export function createProdDeps(): AppContainer {
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
