import { NotFoundError } from '../../../shared/errors/not-found-error';
import { DocumentLogRepository } from '../domain/document-log.repository';

export class DeleteDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute({
    documentLogId,
    ownerId,
  }: {
    documentLogId: string;
    ownerId: string;
  }): Promise<void> {
    const deleted = await this.repo.deleteByIdForOwner(documentLogId, ownerId);

    if (!deleted) {
      throw new NotFoundError('Document Log', documentLogId);
    }
  }
}
