import type { CursorResult } from '../../../shared/contracts/cursor-result';
import type { DocumentLogRepository } from '../contracts/document-log.repository';
import type { DocumentLogCursor, DocumentLogListQuery } from '../contracts/document-log-list.query';
import type { DocumentLog } from '../domain/document-log';

import type { ListDocumentLogsInput } from './dto/list-document-logs.dto';

export class ListDocumentLogsUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: ListDocumentLogsInput): Promise<CursorResult<DocumentLog, DocumentLogCursor>> {
    const cursor =
      input.createdAt && input.id
        ? {
            createdAt: input.createdAt,
            id: input.id,
          }
        : undefined;

    const query: DocumentLogListQuery = {
      ownerId: input.ownerId,
      vehicleId: input.vehicleId,
      cursor,
      limit: input.limit,
    };

    return this.repo.list(query);
  }
}
