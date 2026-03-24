import type { DocumentLog, UpdatableDocumentLogFields } from './document-log';
import type { PaginatedResult } from '../../../shared/domain/paginated-result';
import type { DocumentLogListQuery } from './document-log-list.query';

export interface DocumentLogRepository {
  create(documentLog: DocumentLog): Promise<DocumentLog>;
  list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>>;
  findByIdForOwner(id: string, ownerId: string): Promise<DocumentLog | null>;
  deleteByIdForOwner(id: string, ownerId: string): Promise<boolean>;
  updateByIdForOwner(
    id: string,
    ownerId: string,
    patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null>;
}
