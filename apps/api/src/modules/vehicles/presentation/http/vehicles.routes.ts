import type { FastifyInstance } from 'fastify';

import { vehicleIdParamsSchema } from '../../../../shared/http/params/vehicle-id.schema';
import { parseBody, parseParams, parseQuery } from '../../../../shared/http/validation';
import { createVehiclesServices } from '../../vehicles.factory';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';

export async function vehiclesRoutes(app: FastifyInstance) {
  const {
    createVehicleUseCase,
    listVehiclesUseCase,
    getVehicleUseCase,
    deleteVehicleUseCase,
    updateVehicleUseCase,
  } = createVehiclesServices(app);

  app.post('/', async (req, reply) => {
      const body = parseBody(createVehicleHttpSchema, req.body);

      const created = await createVehicleUseCase.execute({ ...body, ownerId: req.user.sub });

      return reply.code(201).send(created);
  });

  app.get('/', async (req) => {
      const query = parseQuery(listVehiclesQuerySchema, req.query);

      return listVehiclesUseCase.execute({ ...query, ownerId: req.user.sub });
  });

  app.get('/:vehicleId', async (req) => {
      const params = parseParams(vehicleIdParamsSchema, req.params);

      return getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
  });

  app.delete('/:vehicleId', async (req, reply) => {
      const params = parseParams(vehicleIdParamsSchema, req.params);

      await deleteVehicleUseCase.execute({ ...params, ownerId: req.user.sub });

      return reply.code(204).send();
  });

  app.patch('/:vehicleId', async (req, reply) => {
      const params = parseParams(vehicleIdParamsSchema, req.params);
      const body = parseBody(updateVehicleHttpSchema, req.body);

      const updated = await updateVehicleUseCase.execute({
        vehicleId: params.vehicleId,
        ownerId: req.user.sub,
        patch: body,
      });

      return reply.code(200).send(updated);
  });
}
