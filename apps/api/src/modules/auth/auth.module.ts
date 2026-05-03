import type { FastifyInstance } from 'fastify';

import { requireAuthGuard } from '../../shared/auth/require-auth.guard';
import { createTokenBucketGuard } from '../../shared/rate-limit/presentation/token-bucket.guard';
import { apiRateLimitConfig } from '../../shared/rate-limit/rate-limit.config';

import { authRoutes } from './presentation/http/auth.routes';
import { createAuthServices } from './auth.services';

export async function authModule(app: FastifyInstance) {
  const authServices = createAuthServices({ repository: app.deps.userRepository });
  const loginRateLimit = createTokenBucketGuard(
    app.deps.consumeTokenBucketUseCase,
    apiRateLimitConfig,
  );
  const requireAuth = requireAuthGuard;
  await app.register(
    async function authApi(api) {
      await api.register(authRoutes, {
        services: authServices,
        guards: { loginRateLimit, requireAuth },
      });
    },
    { prefix: '/auth' },
  );
}
