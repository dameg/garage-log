import type { CursorResult } from '../../../../shared/contracts/cursor-result';
import type { DocumentRepository } from '../../contracts/document.repository';
import type { DocumentCursor, DocumentListQuery } from '../../contracts/document--list.query';
import type { Document, UpdatableDocumentFields } from '../../domain/document';

export class SpyDocumentRepository implements DocumentRepository {
  public lastListQuery: DocumentListQuery | null = null;

  constructor(
    private readonly result: CursorResult<Document, DocumentCursor> = {
      data: [],
      nextCursor: null,
    },
  ) {}

  async create(document: Document): Promise<Document> {
    return document;
  }

  async list(query: DocumentListQuery): Promise<CursorResult<Document, DocumentCursor>> {
    this.lastListQuery = query;
    return this.result;
  }

  async findByIdForOwnerAndVehicle(
    _id: string,
    _ownerId: string,
    _vehicleId: string,
  ): Promise<Document | null> {
    return null;
  }

  async deleteByIdForOwnerAndVehicle(
    _id: string,
    _ownerId: string,
    _vehicleId: string,
  ): Promise<boolean> {
    return false;
  }

  async updateByIdForOwnerAndVehicle(
    _id: string,
    _ownerId: string,
    _vehicleId: string,
    _patch: UpdatableDocumentFields,
  ): Promise<Document | null> {
    return null;
  }
}
