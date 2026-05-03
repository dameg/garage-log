import type { FastifyInstance } from 'fastify';

import { authRoutes } from './presentation/http/auth.routes';
import { createAuthServices } from './auth.services';

import { requireAuthGuard } from '@/shared/auth';
import {
  createSlidingWindowGuard,
  loginEmailIpSubject,
  loginRateLimitConfig,
} from '@/shared/rate-limit';

export async function authModule(app: FastifyInstance) {
  const authServices = createAuthServices({ repository: app.deps.userRepository });
  const loginRateLimit = createSlidingWindowGuard(app.deps.checkSlidingWindowUseCase, {
    ...loginRateLimitConfig,
    subjectFactory: loginEmailIpSubject,
  });
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
