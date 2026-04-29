import type { CursorResult } from '../../../../shared/contracts/cursor-result';
import type { DocumentLogRepository } from '../../contracts/document-log.repository';
import type { DocumentLogCursor, DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLog, UpdatableDocumentLogFields } from '../../domain/document-log';

export class SpyDocumentLogRepository implements DocumentLogRepository {
  public lastListQuery: DocumentLogListQuery | null = null;

  constructor(
    private readonly result: CursorResult<DocumentLog, DocumentLogCursor> = {
      data: [],
      nextCursor: null,
    },
  ) {}

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    return documentLog;
  }

  async list(query: DocumentLogListQuery): Promise<CursorResult<DocumentLog, DocumentLogCursor>> {
    this.lastListQuery = query;
    return this.result;
  }

  async findByIdForOwnerAndVehicle(
    _id: string,
    _ownerId: string,
    _vehicleId: string,
  ): Promise<DocumentLog | null> {
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
    _patch: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null> {
    return null;
  }
}
