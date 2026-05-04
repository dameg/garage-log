import type { FastifyInstance } from 'fastify';

import { VehicleCacheInvalidator } from './cache/vehicle-cache-invalidator';
import { documentRoutes } from './presentation/http/document.routes';
import { vehicleRoutes } from './presentation/http/vehicle.routes';
import { createDocumentServices } from './document.services';
import { createVehicleServices } from './vehicle.services';

import { requireAuthGuard } from '@/shared/auth';
import { createCacheReadHook, createCacheWriteHook } from '@/shared/cache';
import { apiRateLimitConfig, createTokenBucketGuard } from '@/shared/rate-limit';

export async function vehicleModule(app: FastifyInstance) {
  const vehicleServices = createVehicleServices({ repository: app.deps.vehicleRepository });
  const documentServices = createDocumentServices({ repository: app.deps.documentRepository });
  const apiRateLimit = createTokenBucketGuard(
    app.deps.consumeTokenBucketUseCase,
    apiRateLimitConfig,
  );
  const cacheRead = createCacheReadHook(app.deps.redisService);
  const cacheWrite = createCacheWriteHook(app.deps.redisService);
  const cacheInvalidator = new VehicleCacheInvalidator(app.deps.redisService);
  const requireAuth = requireAuthGuard;

  await app.register(
    async function vehicleApi(api) {
      api.addHook('preHandler', requireAuth);
      api.addHook('preHandler', apiRateLimit);
      api.addHook('preHandler', cacheRead);
      api.addHook('onSend', cacheWrite);

      await api.register(vehicleRoutes, {
        services: vehicleServices,
        cacheInvalidator,
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
