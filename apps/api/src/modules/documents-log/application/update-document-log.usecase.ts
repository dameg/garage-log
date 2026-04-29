import { NotFoundError } from '../../../shared/errors/not-found-error';
import type { DocumentLogRepository } from '../contracts/document-log.repository';
import {
  type DocumentLog,
  type UpdatableDocumentLogFields,
  updateDocumentLog,
} from '../domain/document-log';

import type { UpdateDocumentLogInput } from './dto/update-document-log.dto';

function toUpdatableFields(documentLog: DocumentLog): UpdatableDocumentLogFields {
  return {
    type: documentLog.type,
    title: documentLog.title,
    issuer: documentLog.issuer,
    validFrom: documentLog.validFrom,
    validTo: documentLog.validTo,
    issuedAt: documentLog.issuedAt,
    cost: documentLog.cost,
    note: documentLog.note,
  };
}

export class UpdateDocumentLogUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: UpdateDocumentLogInput): Promise<DocumentLog> {
    const existing = await this.repo.findByIdForOwnerAndVehicle(
      input.documentLogId,
      input.ownerId,
      input.vehicleId,
    );

    if (!existing) {
      throw new NotFoundError('Document Log', input.documentLogId);
    }

    const next = updateDocumentLog(existing, input.patch);

    const updated = await this.repo.updateByIdForOwnerAndVehicle(
      input.documentLogId,
      input.ownerId,
      input.vehicleId,
      toUpdatableFields(next),
    );

    if (!updated) {
      throw new NotFoundError('Document Log', input.documentLogId);
    }

    return updated;
  }
}
