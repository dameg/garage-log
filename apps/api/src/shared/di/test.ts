import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../rate-limit/test/allow-all-rate-limiters';
import { createInMemoryRedisService } from '../testing/in-memory-redis';

import type { AppContainer } from './types';

import { InMemoryUserRepository } from '@/modules/auth/infrastructure/in-memory-user.repository';
import { InMemoryDocumentRepository } from '@/modules/vehicle/test/in-memory/in-memory-document.repository';
import { InMemoryVehicleRepository } from '@/modules/vehicle/test/in-memory/in-memory-vehicle.repository';

export function createTestAppContainer(): AppContainer {
  const redisService = createInMemoryRedisService();

  return {
    redisService,
    userRepository: new InMemoryUserRepository(),
    vehicleRepository: new InMemoryVehicleRepository(),
    documentRepository: new InMemoryDocumentRepository(),
    consumeTokenBucketUseCase: new AllowAllConsumeTokenBucketUseCase(),
    checkSlidingWindowUseCase: new AllowAllCheckSlidingWindowUseCase(),
  };
}
