import type { DocumentLog } from './document-log';
import type { PaginatedResult } from '../../../shared/domain/paginated-result';

export interface DocumentLogRepository {
  create(documentLog: DocumentLog): Promise<DocumentLog>;
  findManyByVehicle(query: any): Promise<PaginatedResult<DocumentLog>>;
  findByIdForOwner(id: string, ownerId: string): Promise<DocumentLog | null>;
  deleteByIdForOwner(id: string, ownerId: string): Promise<boolean>;
  updateByIdForOwner(id: string, ownerId: string, patch: any): Promise<DocumentLog | null>;
}
