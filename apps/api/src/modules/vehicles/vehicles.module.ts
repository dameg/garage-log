import type { FastifyInstance } from 'fastify';
import { vehiclesRoutes } from './presentation/http/vehicles.routes';

export async function vehiclesModule(app: FastifyInstance) {
  await app.register(vehiclesRoutes, { prefix: '/vehicles' });
}
