import type { FastifyInstance } from 'fastify';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { createVehiclesServices } from '../../vehicles.factory';
import { vehicleIdParamsSchema } from '../validation/vehice-id.schema';
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
    const parsed = createVehicleHttpSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid request body',
        issues: parsed.error.issues,
      });
    }
    const created = await createVehicleUseCase.execute(parsed.data);
    return reply.code(201).send(created);
  });

  app.get('/', listVehiclesUseCase.execute);

  app.get('/:id', async (req) => {
    const params = vehicleIdParamsSchema.parse(req.params);
    return getVehicleUseCase.execute(params);
  });

  app.delete('/:id', async (req, reply) => {
    const params = vehicleIdParamsSchema.parse(req.params);
    await deleteVehicleUseCase.execute(params);
    return reply.code(204).send();
  });

  app.patch('/:id', async (req, reply) => {
    const params = vehicleIdParamsSchema.parse(req.params);

    const parsed = updateVehicleHttpSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid request body',
        issues: parsed.error.issues,
      });
    }

    const updated = await updateVehicleUseCase.execute({
      id: params.id,
      patch: parsed.data,
    });

    return reply.code(200).send(updated);
  });
}
