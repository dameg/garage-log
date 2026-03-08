import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth/require-auth';
import { vehiclesRoutes } from './presentation/http/vehicles.routes';

export async function vehiclesModule(app: FastifyInstance) {
  await app.register(
    async function protectedVehicles(protectedApp) {
      protectedApp.addHook('preHandler', requireAuth);
      await protectedApp.register(vehiclesRoutes);
    },
    {
      prefix: '/vehicles',
    },
  );
}
