import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { DocumentLog } from '../domain/document-log';
import type { DocumentLogRepository } from '../domain/document-log.repository';

export class GetDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute({
    documentLogId,
    ownerId,
    vehicleId,
  }: {
    documentLogId: string;
    ownerId: string;
    vehicleId: string;
  }): Promise<DocumentLog> {
    const documentLog = await this.repo.findByIdForOwnerAndVehicle(
      documentLogId,
      ownerId,
      vehicleId,
    );
    if (!documentLog) {
      throw new NotFoundError('Document log', documentLogId);
    }

    return documentLog;
  }
}
