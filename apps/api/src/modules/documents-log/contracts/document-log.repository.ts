import type { CursorResult } from '../../../shared/contracts/cursor-result';
import type { DocumentLog, UpdatableDocumentLogFields } from '../domain/document-log';

import type { DocumentLogCursor, DocumentLogListQuery } from './document-log-list.query';

export interface DocumentLogRepository {
  create(documentLog: DocumentLog): Promise<DocumentLog>;
  list(query: DocumentLogListQuery): Promise<CursorResult<DocumentLog, DocumentLogCursor>>;
  findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<DocumentLog | null>;
  deleteByIdForOwnerAndVehicle(id: string, ownerId: string, vehicleId: string): Promise<boolean>;
  updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null>;
}
