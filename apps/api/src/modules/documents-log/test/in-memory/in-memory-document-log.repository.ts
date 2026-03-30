import type { DocumentLogRepository } from '../../domain/document-log.repository';
import type {
  DocumentLog,
  UpdatableDocumentLogFields,
} from '../../domain/document-log';
import type { DocumentLogListQuery } from '../../domain/document-log-list.query';
import type { PaginatedResult } from '../../../../shared/domain/paginated-result';

export class InMemoryDocumentLogRepository implements DocumentLogRepository {
  private data: DocumentLog[] = [];

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    this.data.push(documentLog);
    return documentLog;
  }

  async list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>> {
    return {
      data: [],
      total: 0,
      page: query.page,
      limit: query.limit,
    };
  }

  async findByIdForOwner(id: string, ownerId: string): Promise<DocumentLog | null> {
    return (
      this.data.find((documentLog) => documentLog.id === id && documentLog.ownerId === ownerId) ||
      null
    );
  }

  async deleteByIdForOwner(id: string, ownerId: string): Promise<boolean> {
    const previousLength = this.data.length;

    this.data = this.data.filter(
      (documentLog) => !(documentLog.id === id && documentLog.ownerId === ownerId),
    );

    return this.data.length < previousLength;
  }

  async updateByIdForOwner(
    id: string,
    ownerId: string,
    patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null> {
    const index = this.data.findIndex(
      (documentLog) => documentLog.id === id && documentLog.ownerId === ownerId,
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
