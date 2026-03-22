import type { FastifyInstance } from 'fastify';
import { createTokenBucketGuard } from './presentation/token-bucket.guard';
import {
  createSlidingWindowGuard,
  loginEmailIpSubjectFactory,
} from './presentation/sliding-window.guard';

export const apiRateLimitConfig = {
  capacity: 60,
  refillRatePerSec: 1,
} as const;

export const loginRateLimitConfig = {
  limit: 5,
  windowSec: 600,
} as const;

export function createRateLimitServices(app: FastifyInstance) {
  return {
    apiRateLimitGuard: createTokenBucketGuard(
      app.deps.consumeTokenBucketUseCase,
      apiRateLimitConfig,
    ),

    loginRateLimitGuard: createSlidingWindowGuard(app.deps.checkSlidingWindowUseCase, {
      ...loginRateLimitConfig,
      subjectFactory: loginEmailIpSubjectFactory,
    }),
  };
}
