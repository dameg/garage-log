import type { FastifyInstance } from 'fastify';

import { parseBody, parseParams, parseQuery, vehicleIdParamsSchema } from '../../../../shared/http';
import { createDocumentHttpSchema } from '../validation/create-document.schema';
import { documentIdParamsSchema } from '../validation/document-id.schema';
import { listDocumentsQuerySchema } from '../validation/list-documents-query.schema';
import { updateDocumentHttpSchema } from '../validation/update-document.schema';

import type { DocumentRoutesOptions } from './document.routes.types';

export async function documentRoutes(app: FastifyInstance, { services }: DocumentRoutesOptions) {
  app.post('/', async (req, reply) => {
    const params = parseParams(vehicleIdParamsSchema, req.params);
    const body = parseBody(createDocumentHttpSchema, req.body);

    const created = await services.createDocumentUseCase.execute({
      ...body,
      ...params,
      ownerId: req.user.sub,
    });

    return reply.status(201).send(created);
  });

  app.get('/', async (req) => {
    const query = parseQuery(listDocumentsQuerySchema, req.query);
    const params = parseParams(vehicleIdParamsSchema, req.params);

    return services.listDocumentsUseCase.execute({
      ...query,
      ...params,
      ownerId: req.user.sub,
    });
  });

  app.get('/:documentId', async (req) => {
    const vehicleParams = parseParams(vehicleIdParamsSchema, req.params);
    const params = parseParams(documentIdParamsSchema, req.params);

    return services.getDocumentUseCase.execute({
      ...vehicleParams,
      ...params,
      ownerId: req.user.sub,
    });
  });

  app.delete('/:documentId', async (req, reply) => {
    const vehicleParams = parseParams(vehicleIdParamsSchema, req.params);
    const params = parseParams(documentIdParamsSchema, req.params);

    await services.deleteDocumentUseCase.execute({
      ...vehicleParams,
      ...params,
      ownerId: req.user.sub,
    });

    return reply.status(204).send();
  });

  app.patch('/:documentId', async (req, reply) => {
    const vehicleParams = parseParams(vehicleIdParamsSchema, req.params);
    const params = parseParams(documentIdParamsSchema, req.params);
    const body = parseBody(updateDocumentHttpSchema, req.body);

    const updated = await services.updateDocumentUseCase.execute({
      vehicleId: vehicleParams.vehicleId,
      documentId: params.documentId,
      ownerId: req.user.sub,
      patch: body,
    });

    return reply.code(200).send(updated);
  });
}
