import type { FastifyInstance } from 'fastify';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { createVehiclesServices } from '../../vehicles.factory';
import { vehicleIdParamsSchema } from '../validation/vehice-id.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';

import z from 'zod';

export async function vehiclesRoutes(app: FastifyInstance) {
  const {
    createVehicleUseCase,
    listVehicleUseCase,
    getVehicleUseCase,
    deleteVehicleUseCase,
    updateVehicleUseCase,
  } = createVehiclesServices(app);

  app.post(
    '/',
    {
      schema: {
        tags: ['vehicles'],
        summary: 'Create vehicle',
        description: 'Creates a new vehicle',
        body: z.toJSONSchema(createVehicleHttpSchema, {
          target: 'draft-07',
        }),
      },
    },
    async (req, reply) => {
      const body = createVehicleHttpSchema.parse(req.body);

      const created = await createVehicleUseCase.execute({ ...body, ownerId: req.user.sub });

      return reply.code(201).send(created);
    },
  );

  app.get(
    '/',
    {
      schema: {
        tags: ['vehicles'],
        summary: 'List vehicles',
        description: 'Returns vehicles for authenticated user',
      },
    },
    async (req) => {
      const query = listVehiclesQuerySchema.parse(req.query);

      return listVehicleUseCase.execute({ ...query, ownerId: req.user.sub });
    },
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['vehicles'],
        summary: 'Get vehicle by id',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (req) => {
      const params = vehicleIdParamsSchema.parse(req.params);

      return getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
    },
  );

  app.delete('/:id', async (req, reply) => {
    const params = vehicleIdParamsSchema.parse(req.params);

    await deleteVehicleUseCase.execute({ ...params, ownerId: req.user.sub });

    return reply.code(204).send();
  });

  app.patch('/:id', async (req, reply) => {
    const params = vehicleIdParamsSchema.parse(req.params);

    const body = updateVehicleHttpSchema.parse(req.body);

    const updated = await updateVehicleUseCase.execute({
      id: params.id,
      ownerId: req.user.sub,
      patch: body,
    });

    return reply.code(200).send(updated);
  });
}
