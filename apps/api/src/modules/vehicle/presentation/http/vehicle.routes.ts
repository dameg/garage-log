import type { FastifyInstance } from 'fastify';

import { parseBody, parseParams, parseQuery, vehicleIdParamsSchema } from '../../../../shared/http';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';

import type { VehicleRoutesOptions } from './vehicle.routes.types';

export async function vehicleRoutes(app: FastifyInstance, { services }: VehicleRoutesOptions) {
  app.post('/', async (req, reply) => {
    const body = parseBody(createVehicleHttpSchema, req.body);

    const created = await services.createVehicleUseCase.execute({
      ...body,
      ownerId: req.user.sub,
    });

    return reply.code(201).send(created);
  });

  app.get('/', async (req) => {
    const query = parseQuery(listVehiclesQuerySchema, req.query);

    return services.listVehiclesUseCase.execute({ ...query, ownerId: req.user.sub });
  });

  app.get('/:vehicleId', async (req) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);

    return services.getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
  });

  app.delete('/:vehicleId', async (req, reply) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);

    await services.deleteVehicleUseCase.execute({ ...params, ownerId: req.user.sub });

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

    return reply.code(200).send(updated);
  });
}
