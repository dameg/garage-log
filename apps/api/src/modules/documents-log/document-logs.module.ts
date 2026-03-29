import type { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth/require-auth';
import { createRateLimitServices } from '../../shared/rate-limit/rate-limit.factory';

export async function documentLogsModule(app: FastifyInstance) {
  await app.register(
    async function protectedDocumentLogs(protectedApp) {
      protectedApp.addHook('preHandler', requireAuth);

      const { apiRateLimitGuard } = createRateLimitServices(protectedApp);

      protectedApp.addHook('preHandler', apiRateLimitGuard);
    },
    {
      prefix: '/vehicles/:vehicleId/document-logs',
    },
  );
}
