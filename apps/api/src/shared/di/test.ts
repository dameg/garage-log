import type Redis from 'ioredis';

import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../rate-limit/test/allow-all-rate-limiters';
import { RedisService } from '../redis/redis.service';

import type { AppContainer } from './types';

import { InMemoryUserRepository } from '@/modules/auth/infrastructure/in-memory-user.repository';
import { InMemoryDocumentRepository } from '@/modules/vehicle/test/in-memory/in-memory-document.repository';
import { InMemoryVehicleRepository } from '@/modules/vehicle/test/in-memory/in-memory-vehicle.repository';

export function createTestAppContainer(): AppContainer {
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as unknown as Redis);

  return {
    redisService,
    userRepository: new InMemoryUserRepository(),
    vehicleRepository: new InMemoryVehicleRepository(),
    documentRepository: new InMemoryDocumentRepository(),
    consumeTokenBucketUseCase: new AllowAllConsumeTokenBucketUseCase(),
    checkSlidingWindowUseCase: new AllowAllCheckSlidingWindowUseCase(),
  };
}
