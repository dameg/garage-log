import type { FastifyInstance } from 'fastify';

import { requireAuthGuard } from '../../shared/auth/require-auth.guard';
import { createTokenBucketGuard } from '../../shared/rate-limit/presentation/token-bucket.guard';
import { apiRateLimitConfig } from '../../shared/rate-limit/rate-limit.config';

import { documentRoutes } from './presentation/http/document.routes';
import { vehicleRoutes } from './presentation/http/vehicle.routes';
import { createDocumentServices } from './document.services';
import { createVehicleServices } from './vehicle.services';

export async function vehicleModule(app: FastifyInstance) {
  const vehicleServices = createVehicleServices({ repository: app.deps.vehicleRepository });
  const documentServices = createDocumentServices({ repository: app.deps.documentRepository });
  const apiRateLimit = createTokenBucketGuard(
    app.deps.consumeTokenBucketUseCase,
    apiRateLimitConfig,
  );
  const requireAuth = requireAuthGuard;

  await app.register(
    async function vehicleApi(api) {
      api.addHook('preHandler', requireAuth);
      api.addHook('preHandler', apiRateLimit);
      await api.register(vehicleRoutes, {
        services: vehicleServices,
      });

      await api.register(documentRoutes, {
        prefix: '/:vehicleId/documents',
        services: documentServices,
      });
    },
    {
      prefix: '/vehicles',
    },
  );
}
