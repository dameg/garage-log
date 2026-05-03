import type { DocumentRepository } from '../contracts/document.repository';
import { type Document, type UpdatableDocumentFields, updateDocument } from '../domain/document';

import type { UpdateDocumentInput } from './dto/update-document.dto';

import { NotFoundError } from '@/shared/errors';

function toUpdatableFields(document: Document): UpdatableDocumentFields {
  return {
    type: document.type,
    title: document.title,
    issuer: document.issuer,
    validFrom: document.validFrom,
    validTo: document.validTo,
    issuedAt: document.issuedAt,
    cost: document.cost,
    note: document.note,
  };
}

export class UpdateDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(input: UpdateDocumentInput): Promise<Document> {
    const existing = await this.repo.findByIdForOwnerAndVehicle(
      input.documentId,
      input.ownerId,
      input.vehicleId,
    );

    if (!existing) {
      throw new NotFoundError('Document ', input.documentId);
    }

    const next = updateDocument(existing, input.patch);

    const updated = await this.repo.updateByIdForOwnerAndVehicle(
      input.documentId,
      input.ownerId,
      input.vehicleId,
      toUpdatableFields(next),
    );

    if (!updated) {
      throw new NotFoundError('Document ', input.documentId);
    }

    return updated;
  }
}
