import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { DocumentLog } from '../domain/document-log';
import type { DocumentLogRepository } from '../domain/document-log.repository';

export class GetDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute({ id, ownerId }: { id: string; ownerId: string }): Promise<DocumentLog> {
    const documentLog = await this.repo.findByIdForOwner(id, ownerId);
    if (!documentLog) {
      throw new NotFoundError('Document log', id);
    }

    return documentLog;
  }
}
