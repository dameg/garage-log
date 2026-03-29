import type { FastifyInstance } from 'fastify';
import { createDocumentLogsServices } from '../../document-logs.factory';
import { createDocumentLogHttpSchema } from '../validation/create-document-log.schema';
import { vehicleIdParamsSchema } from '../../../../shared/http/params/vehicle-id.schema';
import { parseBody, parseParams } from '../../../../shared/http/validation';

export async function documentLogsRoutes(app: FastifyInstance) {
  const {
    createDocumentLogUseCase,
    listDocumentLogsUseCase,
    getDocumentLogUseCase,
    deleteDocumentLogUseCase,
    updateDocumentLogUseCase,
  } = createDocumentLogsServices(app);

  app.post('/', async (req, reply) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);
    const body = parseBody(createDocumentLogHttpSchema, req.body);

    const created = await createDocumentLogUseCase.execute({
      ...body,
      ...params,
      ownerId: req.user.sub,
    });

    return reply.status(201).send(created);
  });

  app.get('/', async (req, reply) => {});

  app.get('/:id', async (req, reply) => {});

  app.delete('/:id', async (req, reply) => {});

  app.patch('/:id', async (req, reply) => {});
}
