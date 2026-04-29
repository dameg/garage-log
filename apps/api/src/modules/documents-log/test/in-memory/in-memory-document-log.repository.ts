import type { CursorResult } from '../../../../shared/contracts/cursor-result';
import type { DocumentLogRepository } from '../../contracts/document-log.repository';
import type { DocumentLogCursor, DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLog, UpdatableDocumentLogFields } from '../../domain/document-log';

import { sortDocumentLogs } from './sort-document-logs';

export class InMemoryDocumentLogRepository implements DocumentLogRepository {
  private data: DocumentLog[] = [];

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    this.data.push(documentLog);
    return documentLog;
  }

  async list(query: DocumentLogListQuery): Promise<CursorResult<DocumentLog, DocumentLogCursor>> {
    const filtered = this.data.filter(
      (documentLog) =>
        documentLog.ownerId === query.ownerId && documentLog.vehicleId === query.vehicleId,
    );

    const sorted = sortDocumentLogs(filtered, query);
    const afterCursor = query.cursor
      ? sorted.filter(
          (documentLog) =>
            documentLog.createdAt < query.cursor!.createdAt ||
            (documentLog.createdAt.getTime() === query.cursor!.createdAt.getTime() &&
              documentLog.id < query.cursor!.id),
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
  ): Promise<DocumentLog | null> {
    return (
      this.data.find(
        (documentLog) =>
          documentLog.id === id &&
          documentLog.ownerId === ownerId &&
          documentLog.vehicleId === vehicleId,
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
      (documentLog) =>
        !(
          documentLog.id === id &&
          documentLog.ownerId === ownerId &&
          documentLog.vehicleId === vehicleId
        ),
    );

    return this.data.length < previousLength;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null> {
    const index = this.data.findIndex(
      (documentLog) =>
        documentLog.id === id &&
        documentLog.ownerId === ownerId &&
        documentLog.vehicleId === vehicleId,
    );

    if (index === -1) {
      return null;
    }

    const updated: DocumentLog = {
      ...this.data[index],
      ...patch,
    };

    this.data[index] = updated;

    return updated;
  }
}
