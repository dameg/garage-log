import { randomUUID } from 'node:crypto';

import type { DocumentRepository } from '../contracts/document.repository';
import { createDocument, type CreateDocumentProps, type Document } from '../domain/document';

import type { CreateDocumentInput } from './dto/create-document.dto';

export class CreateDocumentUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(input: CreateDocumentInput): Promise<Document> {
    const documentProps: CreateDocumentProps = {
      id: randomUUID(),
      vehicleId: input.vehicleId,
      ownerId: input.ownerId,
      type: input.type,
      title: input.title,
      issuer: input.issuer ?? null,
      validFrom: input.validFrom,
      validTo: input.validTo,
      issuedAt: input.issuedAt ?? null,
      cost: input.cost ?? null,
      note: input.note ?? null,
    };

    const document = createDocument(documentProps);

    return this.repo.create(document);
  }
}
