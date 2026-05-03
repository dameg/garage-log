import type { DocumentsListQuery } from '../../contracts/document-list.query';
import type { Document } from '../../domain/document';

export function sortDocuments(documents: Document[], _query: DocumentsListQuery): Document[] {
  return [...documents].sort((a, b) => {
    if (a.createdAt.getTime() === b.createdAt.getTime()) {
      return b.id.localeCompare(a.id);
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
