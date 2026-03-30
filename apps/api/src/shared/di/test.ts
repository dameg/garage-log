import type { Deps } from './types';
import { InMemoryUserRepository } from '../../modules/auth/infrastructure/in-memery-user.repository';
import { InMemoryVehicleRepository } from '../../test/doubles/in-memory/in-memory-vehicle.repository';
import { RedisService } from '../redis/redis.service';
import { InMemoryDocumentLogRepository } from '../../modules/documents-log/test/in-memory/in-memory-document-log.repository';

export function createTestDeps(): Deps {
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as any);

  return {
    redisService,
    usersRepo: new InMemoryUserRepository(),
    vehiclesRepo: new InMemoryVehicleRepository(),
    documentLogsRepo: new InMemoryDocumentLogRepository(),
  };
}
