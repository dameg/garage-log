import type { AppContainer } from './types';
import { InMemoryUserRepository } from '../../modules/auth/infrastructure/in-memery-user.repository';
import { InMemoryVehicleRepository } from '../../modules/vehicles/test/in-memory/in-memory-vehicle.repository';
import { RedisService } from '../redis/redis.service';
import { InMemoryDocumentLogRepository } from '../../modules/documents-log/test/in-memory/in-memory-document-log.repository';
import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../../test/doubles/rate-limit/allow-all-rate-limiters';

export function createTestAppContainer(): AppContainer {
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as any);

  return {
    redisService,
    usersRepo: new InMemoryUserRepository(),
    vehiclesRepo: new InMemoryVehicleRepository(),
    documentLogsRepo: new InMemoryDocumentLogRepository(),
    consumeTokenBucketUseCase: new AllowAllConsumeTokenBucketUseCase(),
    checkSlidingWindowUseCase: new AllowAllCheckSlidingWindowUseCase(),
  };
}
