import type { requireAuthGuard } from '../../../../shared/auth/require-auth.guard';
import type { createTokenBucketGuard } from '../../../../shared/rate-limit/presentation/token-bucket.guard';
import type { createAuthServices } from '../../auth.services';

type AuthGuards = {
  loginRateLimit: ReturnType<typeof createTokenBucketGuard>;
  requireAuth: typeof requireAuthGuard;
};

export type AuthRoutesOptions = {
  services: ReturnType<typeof createAuthServices>;
  guards: AuthGuards;
};
