import type Redis from 'ioredis';

import { InMemoryUserRepository } from '../../modules/auth/infrastructure/in-memery-user.repository';
import { InMemoryDocumentLogRepository } from '../../modules/documents-log/test/in-memory/in-memory-document-log.repository';
import { InMemoryVehicleRepository } from '../../modules/vehicles/test/in-memory/in-memory-vehicle.repository';
import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../rate-limit/test/allow-all-rate-limiters';
import { RedisService } from '../redis/redis.service';

import type { AppContainer } from './types';

export function createTestAppContainer(): AppContainer {
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as unknown as Redis);

  return {
    redisService,
    usersRepo: new InMemoryUserRepository(),
    vehiclesRepo: new InMemoryVehicleRepository(),
    documentLogsRepo: new InMemoryDocumentLogRepository(),
    consumeTokenBucketUseCase: new AllowAllConsumeTokenBucketUseCase(),
    checkSlidingWindowUseCase: new AllowAllCheckSlidingWindowUseCase(),
  };
}
