import { PrismaDocumentLogRepository } from '../../modules/documents-log/infrastructure/prisma/prisma-document-log.repository';
import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../../test/doubles/rate-limit/allow-all-rate-limiters';
import { buildApp } from '../../app';
import { getPrisma } from '../db/prisma';
import { RedisService } from '../redis/redis.service';
import type { AppContainer } from '../di/types';
import { registerAndGetCookie } from '../../test/utils/auth';
import type { TestAppHarness } from './create-test-app';

export async function createDbTestApp(
  overrides: Partial<AppContainer> = {},
): Promise<TestAppHarness> {
  const prisma = getPrisma();
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as any);

  const container: AppContainer = {
    redisService,
    usersRepo: new PrismaUserRepository(prisma),
    vehiclesRepo: new PrismaVehicleRepository(prisma),
    documentLogsRepo: new PrismaDocumentLogRepository(prisma),
    consumeTokenBucketUseCase: new AllowAllConsumeTokenBucketUseCase(),
    checkSlidingWindowUseCase: new AllowAllCheckSlidingWindowUseCase(),
    ...overrides,
  };

  const app = await buildApp(container);
  await app.ready();

  return {
    app,
    container,
    close: () => app.close(),
    registerAndGetCookie: (email?: string) => registerAndGetCookie(app, email),
  };
}
