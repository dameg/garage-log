import type { DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLog } from '../../domain/document-log';

export function sortDocumentLogs(
  documentLogs: DocumentLog[],
  query: DocumentLogListQuery,
): DocumentLog[] {
  const { field, direction } = query.sort;

  return [...documentLogs].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === bValue) {
      return 0;
    }

    if (aValue == null) {
      return direction === 'asc' ? -1 : 1;
    }

    if (bValue == null) {
      return direction === 'asc' ? 1 : -1;
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }

    return direction === 'asc' ? 1 : -1;
  });
}
