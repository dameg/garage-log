import type { FastifyInstance } from 'fastify';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { createVehiclesServices } from '../../vehicles.factory';
import { vehicleIdParamsSchema } from '../validation/vehice-id.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';

export async function vehiclesRoutes(app: FastifyInstance) {
  const {
    createVehicleUseCase,
    listVehicleUseCase,
    getVehicleUseCase,
    deleteVehicleUseCase,
    updateVehicleUseCase,
  } = createVehiclesServices(app);

  app.post('/', async (req, reply) => {
    const body = createVehicleHttpSchema.parse(req.body);

    const created = await createVehicleUseCase.execute({ ...body, ownerId: req.user.sub });

    return reply.code(201).send(created);
  });

  app.get('/', async (req) => {
    const query = listVehiclesQuerySchema.parse(req.query);

    return listVehicleUseCase.execute({ ...query, ownerId: req.user.sub });
  });

  app.get('/:id', async (req) => {
    const params = vehicleIdParamsSchema.parse(req.params);

    return getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
  });

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
