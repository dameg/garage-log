import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { DocumentLog } from '../domain/document-log';
import type { DocumentLogRepository } from '../domain/document-log.repository';

export class GetDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute({
    documentLogId,
    ownerId,
  }: {
    documentLogId: string;
    ownerId: string;
  }): Promise<DocumentLog> {
    const documentLog = await this.repo.findByIdForOwner(documentLogId, ownerId);
    if (!documentLog) {
      throw new NotFoundError('Document log', documentLogId);
    }

    return documentLog;
  }
}
