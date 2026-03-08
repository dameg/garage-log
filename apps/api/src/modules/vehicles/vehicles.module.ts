import type { FastifyInstance } from 'fastify';
import { vehiclesRoutes } from './presentation/http/vehicles.routes';
import { requireAuth } from '../../shared/auth/require-auth';

export async function vehiclesModule(app: FastifyInstance) {
  await app.register(vehiclesRoutes, { prefix: '/vehicles', prehandler: requireAuth });
}
