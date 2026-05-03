import type { DocumentRepository } from '../contracts/document.repository';
import type { DocumentCursor, DocumentsListQuery } from '../contracts/document-list.query';
import type { Document } from '../domain/document';

import type { ListDocumentsInput } from './dto/list-documents.dto';

import type { CursorResult } from '@/shared/contracts';

export class ListDocumentsUseCase {
  constructor(private readonly repo: DocumentRepository) {}

  async execute(input: ListDocumentsInput): Promise<CursorResult<Document, DocumentCursor>> {
    const cursor =
      input.createdAt && input.id
        ? {
            createdAt: input.createdAt,
            id: input.id,
          }
        : undefined;

    const query: DocumentsListQuery = {
      ownerId: input.ownerId,
      vehicleId: input.vehicleId,
      cursor,
      limit: input.limit,
    };

    return this.repo.list(query);
  }
}
