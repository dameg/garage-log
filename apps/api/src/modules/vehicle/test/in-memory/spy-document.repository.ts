import type { DocumentRepository } from '../../contracts/document.repository';
import type { DocumentCursor, DocumentsListQuery } from '../../contracts/document-list.query';
import type { Document, UpdatableDocumentFields } from '../../domain/document';

import type { CursorResult } from '@/shared/contracts';

export class SpyDocumentRepository implements DocumentRepository {
  public lastListQuery: DocumentsListQuery | null = null;
  public lastCreatedDocument: Document | null = null;
  public lastFindArgs: { id: string; ownerId: string; vehicleId: string } | null = null;
  public lastDeleteArgs: { id: string; ownerId: string; vehicleId: string } | null = null;
  public lastUpdateArgs:
    | {
        id: string;
        ownerId: string;
        vehicleId: string;
        patch: UpdatableDocumentFields;
      }
    | null = null;

  constructor(
    private readonly options: {
      listResult?: CursorResult<Document, DocumentCursor>;
      foundDocument?: Document | null;
      deleteResult?: boolean;
      updateResult?: Document | null;
    } = {},
  ) {}

  async create(document: Document): Promise<Document> {
    this.lastCreatedDocument = document;
    return document;
  }

  async list(query: DocumentsListQuery): Promise<CursorResult<Document, DocumentCursor>> {
    this.lastListQuery = query;
    return this.options.listResult ?? {
      data: [],
      nextCursor: null,
    };
  }

  async findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<Document | null> {
    this.lastFindArgs = { id, ownerId, vehicleId };
    return this.options.foundDocument ?? null;
  }

  async deleteByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<boolean> {
    this.lastDeleteArgs = { id, ownerId, vehicleId };
    return this.options.deleteResult ?? false;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentFields,
  ): Promise<Document | null> {
    this.lastUpdateArgs = { id, ownerId, vehicleId, patch };
    return this.options.updateResult ?? null;
  }
}
