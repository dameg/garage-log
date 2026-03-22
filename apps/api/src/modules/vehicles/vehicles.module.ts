import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth/require-auth';
import { vehiclesRoutes } from './presentation/http/vehicles.routes';
import { createRateLimitServices } from '../../shared/rate-limit/rate-limit.factory';

export async function vehiclesModule(app: FastifyInstance) {
  await app.register(
    async function protectedVehicles(protectedApp) {
      protectedApp.addHook('preHandler', requireAuth);

      const { apiRateLimitGuard } = createRateLimitServices(protectedApp);

      protectedApp.addHook('preHandler', apiRateLimitGuard);

      await protectedApp.register(vehiclesRoutes);
    },
    {
      prefix: '/vehicles',
    },
  );
}
