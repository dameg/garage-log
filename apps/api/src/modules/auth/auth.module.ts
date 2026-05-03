import type { FastifyInstance } from 'fastify';

import { requireAuthGuard } from '../../shared/auth';
import {
  createSlidingWindowGuard,
  loginEmailIpSubjectFactory,
  loginRateLimitConfig,
} from '../../shared/rate-limit';

import { authRoutes } from './presentation/http/auth.routes';
import { createAuthServices } from './auth.services';

export async function authModule(app: FastifyInstance) {
  const authServices = createAuthServices({ repository: app.deps.userRepository });
  const loginRateLimit = createSlidingWindowGuard(app.deps.checkSlidingWindowUseCase, {
    ...loginRateLimitConfig,
    subjectFactory: loginEmailIpSubjectFactory,
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
