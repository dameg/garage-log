import type { DocumentRepository } from '../contracts/document.repository';
import type { Document } from '../domain/document';

import { NotFoundError } from '@/shared/errors';

export class GetDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute({
    documentId,
    ownerId,
    vehicleId,
  }: {
    documentId: string;
    ownerId: string;
    vehicleId: string;
  }): Promise<Document> {
    const document = await this.repo.findByIdForOwnerAndVehicle(documentId, ownerId, vehicleId);
    if (!document) {
      throw new NotFoundError('Document', documentId);
    }

    return document;
  }
}
