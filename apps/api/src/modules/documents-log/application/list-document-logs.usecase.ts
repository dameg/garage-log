import type { PaginatedResult } from '../../../shared/contracts/paginated-result';
import type { DocumentLogListQuery } from '../contracts/document-log-list.query';
import type { DocumentLogRepository } from '../contracts/document-log.repository';
import type { DocumentLog } from '../domain/document-log';
import type { ListDocumentLogsInput } from './dto/list-document-logs.dto';

export class ListDocumentLogsUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: ListDocumentLogsInput): Promise<PaginatedResult<DocumentLog>> {
    const query: DocumentLogListQuery = {
      ownerId: input.ownerId,
      vehicleId: input.vehicleId,
      cursor: input.cursor,
      limit: input.limit,
    };

    return this.repo.list(query);
  }
}
