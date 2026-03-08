import type { FastifyInstance } from 'fastify';
import { authRoutes } from './presentation/http/auth.routes';

export async function authModule(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' });
}
