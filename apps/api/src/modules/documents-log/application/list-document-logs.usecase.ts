import type { PaginatedResult } from '../../../shared/domain/paginated-result';
import type { DocumentLog } from '../domain/document-log';
import type { DocumentLogListQuery } from '../domain/document-log-list.query';
import type { DocumentLogRepository } from '../domain/document-log.repository';
import type { ListDocumentLogsInput } from './dto/list-document-logs.dto';

export class ListDocumentLogsUseCase {
  constructor(private readonly repo: DocumentLogRepository) {}

  async execute(input: ListDocumentLogsInput): Promise<PaginatedResult<DocumentLog>> {
    const query: DocumentLogListQuery = {
      ownerId: input.ownerId,
      vehicleId: input.vehicleId,
      filters: {
        search: input.search,
        type: input.type,
        issuer: input.issuer,
        costFrom: input.costFrom,
        costTo: input.costTo,
        hasCost: input.hasCost,
        issuedAtFrom: input.issuedAtFrom,
        issuedAtTo: input.issuedAtTo,
        validFromFrom: input.validFromFrom,
        validFromTo: input.validFromTo,
        validToFrom: input.validToFrom,
        validToTo: input.validToTo,
      },
      sort: {
        field: input.sortBy,
        direction: input.direction,
      },
      page: input.page,
      limit: input.limit,
    };

    return this.repo.list(query);
  }
}
