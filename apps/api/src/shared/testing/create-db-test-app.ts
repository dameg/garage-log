import type Redis from 'ioredis';

import { buildApp } from '../../app';
import { PrismaUserRepository } from '../../modules/auth/infrastructure/prisma/prisma-user.repository';
import { PrismaDocumentLogRepository } from '../../modules/documents-log/infrastructure/prisma/prisma-document-log.repository';
import { PrismaVehicleRepository } from '../../modules/vehicles/infrastructure/prisma/prisma-vehicle.repository';
import { getPrisma } from '../db/prisma';
import type { AppContainer } from '../di/types';
import {
  AllowAllCheckSlidingWindowUseCase,
  AllowAllConsumeTokenBucketUseCase,
} from '../rate-limit/test/allow-all-rate-limiters';
import { RedisService } from '../redis/redis.service';

import type { TestAppHarness } from './create-test-app';
import { registerAndGetCookie } from './register-and-get-cookie';

export async function createDbTestApp(
  overrides: Partial<AppContainer> = {},
): Promise<TestAppHarness> {
  const prisma = getPrisma();
  const redisService = new RedisService({
    ping: async () => 'PONG',
    quit: async () => 'OK',
  } as unknown as Redis);

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
