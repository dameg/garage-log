import { NotFoundError } from '../../../shared/errors/not-found-error';
import { DocumentLogRepository } from '../domain/document-log.repository';

export class DeleteDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute({
    documentLogId,
    ownerId,
    vehicleId,
  }: {
    documentLogId: string;
    ownerId: string;
    vehicleId: string;
  }): Promise<void> {
    const deleted = await this.repo.deleteByIdForOwnerAndVehicle(
      documentLogId,
      ownerId,
      vehicleId,
    );

    if (!deleted) {
      throw new NotFoundError('Document Log', documentLogId);
    }
  }
}
