import type { FastifyInstance } from 'fastify';
import { createDocumentLogsServices } from '../../document-logs.factory';
import { createDocumentLogHttpSchema } from '../validation/create-document-log.schema';
import { vehicleIdParamsSchema } from '../../../../shared/http/params/vehicle-id.schema';
import { parseBody, parseParams, parseQuery } from '../../../../shared/http/validation';
import { listDocumentLogsQuerySchema } from '../validation/list-document-logs-query.schema';
import { documentLogIdParamsSchema } from '../validation/document-log-id.schema';

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

  app.get('/', async (req, reply) => {
    const query = parseQuery(listDocumentLogsQuerySchema, req.query);

    return listDocumentLogsUseCase.execute({ ...query, ownerId: req.user.sub });
  });

  app.get('/:documentLogId', async (req) => {
    const params = parseParams(documentLogIdParamsSchema, req.params);

    return getDocumentLogUseCase.execute({ ...params, ownerId: req.user.sub });
  });

  app.delete('/:documentLogId', async (req, reply) => {
    const params = parseParams(documentLogIdParamsSchema, req.params);

    await deleteDocumentLogUseCase.execute({ ...params, ownerId: req.user.sub });

    return reply.status(204).send();
  });

  app.patch('/:documentLogId', async (req, reply) => {
    const params = parseParams(documentLogIdParamsSchema, req.params);
    const body = parseBody(createDocumentLogHttpSchema.partial(), req.body);

    const updated = await updateDocumentLogUseCase.execute({
      documentLogId: params.documentLogId,
      ownerId: req.user.sub,
      patch: body,
    });

    return reply.code(200).send(updated);
  });
}
