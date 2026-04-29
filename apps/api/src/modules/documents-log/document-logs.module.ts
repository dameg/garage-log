import type { FastifyInstance } from 'fastify';

import { requireAuth } from '../../shared/auth/require-auth';
import { createRateLimitServices } from '../../shared/rate-limit/rate-limit.factory';

import { documentLogsRoutes } from './presentation/http/document-logs.routes';

export async function documentLogsModule(app: FastifyInstance) {
  await app.register(
    async function protectedDocumentLogs(protectedApp) {
      protectedApp.addHook('preHandler', requireAuth);

      const { apiRateLimitGuard } = createRateLimitServices(protectedApp);

      protectedApp.addHook('preHandler', apiRateLimitGuard);

      await protectedApp.register(documentLogsRoutes);
    },
    {
      prefix: '/vehicles/:vehicleId/document-logs',
    },
  );
}
