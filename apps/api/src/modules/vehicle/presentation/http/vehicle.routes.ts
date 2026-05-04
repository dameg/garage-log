import type { FastifyInstance } from 'fastify';

import { vehicleCache } from '../../cache/vehicle.cache';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';

import type { VehicleRoutesOptions } from './vehicle.routes.types';

import { hashCacheParams } from '@/shared/cache';
import { parseBody, parseParams, parseQuery, vehicleIdParamsSchema } from '@/shared/http';

export async function vehicleRoutes(
  app: FastifyInstance,
  { services, cacheInvalidator }: VehicleRoutesOptions,
) {
  app.post('/', async (req, reply) => {
    const body = parseBody(createVehicleHttpSchema, req.body);

    const created = await services.createVehicleUseCase.execute({
      ...body,
      ownerId: req.user.sub,
    });

    await cacheInvalidator.invalidateAfterCreated({ ownerId: req.user.sub });

    return reply.code(201).send(created);
  });

  app.get(
    '/',
    {
      config: {
        cache: {
          ttlSeconds: 60,
          key: (req) => {
            const query = parseQuery(listVehiclesQuerySchema, req.query);

            const paramsHash = hashCacheParams(query);

            return vehicleCache.list(req.user.sub, paramsHash);
          },
        },
      },
    },
    async (req) => {
      const query = parseQuery(listVehiclesQuerySchema, req.query);

      return services.listVehiclesUseCase.execute({ ...query, ownerId: req.user.sub });
    },
  );

  app.get(
    '/:vehicleId',
    {
      config: {
        cache: {
          ttlSeconds: 60,
          key: (req) => {
            const params = parseParams(vehicleIdParamsSchema, req.params);

            return vehicleCache.detail(req.user.sub, params.vehicleId);
          },
        },
      },
    },
    async (req) => {
      const params = parseParams(vehicleIdParamsSchema, req.params);

      return services.getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
    },
  );

  app.delete('/:vehicleId', async (req, reply) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);

    await services.deleteVehicleUseCase.execute({ ...params, ownerId: req.user.sub });

    await cacheInvalidator.invalidateAfterDeleted({
      ownerId: req.user.sub,
      vehicleId: params.vehicleId,
    });

    return reply.code(204).send();
  });

  app.patch('/:vehicleId', async (req, reply) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);
    const body = parseBody(updateVehicleHttpSchema, req.body);

    const updated = await services.updateVehicleUseCase.execute({
      vehicleId: params.vehicleId,
      ownerId: req.user.sub,
      patch: body,
    });

    await cacheInvalidator.invalidateAfterUpdated({
      ownerId: req.user.sub,
      vehicleId: params.vehicleId,
    });

    return reply.code(200).send(updated);
  });
}
