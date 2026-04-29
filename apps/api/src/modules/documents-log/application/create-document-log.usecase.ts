import { randomUUID } from 'node:crypto';

import type { DocumentLogRepository } from '../contracts/document-log.repository';
import {
  createDocumentLog,
  type CreateDocumentLogProps,
  type DocumentLog,
} from '../domain/document-log';

import type { CreateDocumentLogInput } from './dto/create-document-log.dto';

export class CreateDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: CreateDocumentLogInput): Promise<DocumentLog> {
    const documentLogProps: CreateDocumentLogProps = {
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

    const documentLog = createDocumentLog(documentLogProps);
    return this.repo.create(documentLog);
  }
}
