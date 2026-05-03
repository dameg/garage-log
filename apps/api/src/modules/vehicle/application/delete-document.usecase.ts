import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { DocumentRepository } from '../contracts/document.repository';

export class DeleteDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute({
    documentId,
    ownerId,
    vehicleId,
  }: {
    documentId: string;
    ownerId: string;
    vehicleId: string;
  }): Promise<void> {
    const deleted = await this.repo.deleteByIdForOwnerAndVehicle(documentId, ownerId, vehicleId);

    if (!deleted) {
      throw new NotFoundError('Document', documentId);
    }
  }
}
