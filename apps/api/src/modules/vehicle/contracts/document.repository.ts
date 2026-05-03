import type { CursorResult } from '../../../shared/contracts';
import type { Document, UpdatableDocumentFields } from '../domain/document';

import type { DocumentCursor, DocumentsListQuery } from './document-list.query';

export interface DocumentRepository {
  create(Document: Document): Promise<Document>;
  list(query: DocumentsListQuery): Promise<CursorResult<Document, DocumentCursor>>;
  findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<Document | null>;
  deleteByIdForOwnerAndVehicle(id: string, ownerId: string, vehicleId: string): Promise<boolean>;
  updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentFields,
  ): Promise<Document | null>;
}
