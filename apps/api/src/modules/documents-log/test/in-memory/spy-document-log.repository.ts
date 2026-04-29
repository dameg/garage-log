import type { DocumentLogRepository } from '../../domain/document-log.repository';
import type { DocumentLogListQuery } from '../../domain/document-log-list.query';
import type { DocumentLog } from '../../domain/document-log';
import type { PaginatedResult } from '../../../../shared/domain/paginated-result';

export class SpyDocumentLogRepository implements DocumentLogRepository {
  public lastListQuery: DocumentLogListQuery | null = null;

  constructor(
    private readonly result: PaginatedResult<DocumentLog> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    },
  ) {}

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    return documentLog;
  }

  async list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>> {
    this.lastListQuery = query;
    return this.result;
  }

  async findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<DocumentLog | null> {
    return null;
  }

  async deleteByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<boolean> {
    return false;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    patch: any,
  ): Promise<DocumentLog | null> {
    return null;
  }
}
