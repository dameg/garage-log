import type { DocumentLogListQuery } from '../../../contracts/document-log-list.query';

export function buildDocumentLogWhere(query: DocumentLogListQuery) {
  const { ownerId, vehicleId } = query;

  return {
    ownerId,
    vehicleId,
  };
}
