import type { DocumentLogListQuery } from '../../../domain/document-log-list.query';

export function buildDocumentLogWhere(query: DocumentLogListQuery) {
  const { ownerId, filters } = query;

  return {
    ownerId,
    ...(filters?.search && {
      title: {
        contains: filters.search,
        mode: 'insensitive' as const,
      },
    }),
    ...(filters?.type && {
      type: filters.type,
    }),

    ...(filters?.issuer && {
      issuer: {
        contains: filters.issuer,
        mode: 'insensitive' as const,
      },
    }),
    ...((filters?.costFrom !== undefined ||
      filters?.costTo !== undefined ||
      filters?.hasCost !== undefined) && {
      cost: {
        ...(filters?.costFrom !== undefined && { gte: filters.costFrom }),
        ...(filters?.costTo !== undefined && { lte: filters.costTo }),
        ...(filters?.hasCost && { not: null }),
      },
    }),
    ...((filters?.issuedAtFrom !== undefined || filters?.issuedAtTo !== undefined) && {
      issuedAt: {
        ...(filters?.issuedAtFrom !== undefined && { gte: filters.issuedAtFrom }),
        ...(filters?.issuedAtTo !== undefined && { lte: filters.issuedAtTo }),
      },
    }),
    ...((filters?.validFromFrom !== undefined || filters?.validFromTo !== undefined) && {
      validFrom: {
        ...(filters?.validFromFrom !== undefined && { gte: filters.validFromFrom }),
        ...(filters?.validFromTo !== undefined && { lte: filters.validFromTo }),
      },
    }),
    ...((filters?.validToFrom !== undefined || filters?.validToTo !== undefined) && {
      validTo: {
        ...(filters?.validToFrom !== undefined && { gte: filters.validToFrom }),
        ...(filters?.validToTo !== undefined && { lte: filters.validToTo }),
      },
    }),
  };
}
