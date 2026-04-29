import type { PaginatedResult } from '../../../../shared/contracts/paginated-result';
import type { DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLogRepository } from '../../contracts/document-log.repository';
import type { DocumentLog, UpdatableDocumentLogFields } from '../../domain/document-log';
import { matchesDocumentLogFilters } from './matches-document-log-filters';
import { sortDocumentLogs } from './sort-document-logs';

export class InMemoryDocumentLogRepository implements DocumentLogRepository {
  private data: DocumentLog[] = [];

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    this.data.push(documentLog);
    return documentLog;
  }

  async list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>> {
    const filtered = this.data.filter((documentLog) =>
      matchesDocumentLogFilters(documentLog, query),
    );

    const sorted = sortDocumentLogs(filtered, query);
    const total = sorted.length;
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;

    return {
      data: sorted.slice(start, end),
      total,
      page: query.page,
      limit: query.limit,
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
