import type { DocumentLogListQuery } from '../../../domain/document-log-list.query';

export function buildDocumentLog(query: DocumentLogListQuery) {
  const { ownerId, filters } = query;

  return {
    ownerId,

    ...((filters?.mileageFrom !== undefined || filters?.mileageTo !== undefined) && {
      mileage: {
        ...(filters?.mileageFrom !== undefined && { gte: filters.mileageFrom }),
        ...(filters?.mileageTo !== undefined && { lte: filters.mileageTo }),
      },
    }),
    ...((filters?.yearFrom !== undefined || filters?.yearTo !== undefined) && {
      year: {
        ...(filters?.yearFrom !== undefined && { gte: filters.yearFrom }),
        ...(filters?.yearTo !== undefined && { lte: filters.yearTo }),
      },
    }),
  };
}
