import type { DocumentLog, UpdatableDocumentLogFields } from './document-log';
import type { PaginatedResult } from '../../../shared/domain/paginated-result';
import type { DocumentLogListQuery } from './document-log-list.query';

export interface DocumentLogRepository {
  create(documentLog: DocumentLog): Promise<DocumentLog>;
  list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>>;
  findByIdForOwnerAndVehicle(id: string, ownerId: string, vehicleId: string): Promise<DocumentLog | null>;
  deleteByIdForOwnerAndVehicle(id: string, ownerId: string, vehicleId: string): Promise<boolean>;
  updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null>;
}
