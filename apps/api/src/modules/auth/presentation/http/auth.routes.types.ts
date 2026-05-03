import type { createAuthServices } from '../../auth.services';

import type { requireAuthGuard } from '@/shared/auth';
import type { createSlidingWindowGuard } from '@/shared/rate-limit';

type AuthGuards = {
  loginRateLimit: ReturnType<typeof createSlidingWindowGuard>;
  requireAuth: typeof requireAuthGuard;
};

export type AuthRoutesOptions = {
  services: ReturnType<typeof createAuthServices>;
  guards: AuthGuards;
};
