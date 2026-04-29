import type { DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLog } from '../../domain/document-log';

export function sortDocumentLogs(
  documentLogs: DocumentLog[],
  query: DocumentLogListQuery,
): DocumentLog[] {
  return [...documentLogs].sort((a, b) => {
    if (a.createdAt.getTime() === b.createdAt.getTime()) {
      return b.id.localeCompare(a.id);
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
