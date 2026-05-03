import type { CursorResult } from '../../../../shared/contracts/cursor-result';
import type { DocumentCursor, DocumentsListQuery } from '../../contracts/document-list.query';
import type { Document, UpdatableDocumentFields } from '../../domain/document';
import type { DocumentRepository } from '../../contracts/document.repository';

import { sortDocuments } from './sort-document';

export class InMemoryDocumentRepository implements DocumentRepository {
  private data: Document[] = [];

  async create(document: Document): Promise<Document> {
    this.data.push(document);
    return document;
  }

  async list(query: DocumentsListQuery): Promise<CursorResult<Document, DocumentCursor>> {
    const filtered = this.data.filter(
      (document) => document.ownerId === query.ownerId && document.vehicleId === query.vehicleId,
    );

    const sorted = sortDocuments(filtered, query);
    const afterCursor = query.cursor
      ? sorted.filter(
          (document) =>
            document.createdAt < query.cursor!.createdAt ||
            (document.createdAt.getTime() === query.cursor!.createdAt.getTime() &&
              document.id < query.cursor!.id),
        )
      : sorted;
    const data = afterCursor.slice(0, query.limit);
    const hasMore = afterCursor.length > query.limit;
    const lastRow = data.at(-1);

    return {
      data,
      nextCursor: hasMore && lastRow ? { createdAt: lastRow.createdAt, id: lastRow.id } : null,
    };
  }

  async findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<Document | null> {
    return (
      this.data.find(
        (document) =>
          document.id === id && document.ownerId === ownerId && document.vehicleId === vehicleId,
      ) || null
    );
  }

  async deleteByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<boolean> {
    const previousLength = this.data.length;

    this.data = this.data.filter(
      (document) =>
        !(document.id === id && document.ownerId === ownerId && document.vehicleId === vehicleId),
    );

    return this.data.length < previousLength;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentFields,
  ): Promise<Document | null> {
    const index = this.data.findIndex(
      (document) =>
        document.id === id && document.ownerId === ownerId && document.vehicleId === vehicleId,
    );

    if (index === -1) {
      return null;
    }

    const updated: Document = {
      ...this.data[index],
      ...patch,
    };

    this.data[index] = updated;

    return updated;
  }
}
