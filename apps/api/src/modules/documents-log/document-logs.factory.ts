import type { FastifyInstance } from 'fastify';

import { CreateDocumentLogUseCase } from './application/create-document-log.usecase';
import { DeleteDocumentLogUseCase } from './application/delete-document-log.usecase';
import { GetDocumentLogUseCase } from './application/get-document-log.usecase';
import { ListDocumentLogsUseCase } from './application/list-document-logs.usecase';
import { UpdateDocumentLogUseCase } from './application/update-document-log.usecase';

export function createDocumentLogsServices(app: FastifyInstance) {
  return {
    createDocumentLogUseCase: new CreateDocumentLogUseCase(app.deps.documentLogsRepo),
    listDocumentLogsUseCase: new ListDocumentLogsUseCase(app.deps.documentLogsRepo),
    getDocumentLogUseCase: new GetDocumentLogUseCase(app.deps.documentLogsRepo),
    deleteDocumentLogUseCase: new DeleteDocumentLogUseCase(app.deps.documentLogsRepo),
    updateDocumentLogUseCase: new UpdateDocumentLogUseCase(app.deps.documentLogsRepo),
  };
}
