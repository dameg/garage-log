import type { DocumentLogListQuery } from '../../contracts/document-log-list.query';
import type { DocumentLog } from '../../domain/document-log';

export function matchesDocumentLogFilters(
  documentLog: DocumentLog,
  query: DocumentLogListQuery,
): boolean {
  const { ownerId, filters } = query;

  if (documentLog.ownerId !== ownerId) {
    return false;
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    const searchableFields = [documentLog.title, documentLog.issuer, documentLog.note]
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.toLowerCase());

    if (!searchableFields.some((value) => value.includes(search))) {
      return false;
    }
  }

  if (filters?.type !== undefined && documentLog.type !== filters.type) {
    return false;
  }

  if (filters?.issuer !== undefined && documentLog.issuer !== filters.issuer) {
    return false;
  }

  if (filters?.hasCost !== undefined) {
    const hasCost = documentLog.cost != null;

    if (hasCost !== filters.hasCost) {
      return false;
    }
  }

  if (
    filters?.costFrom !== undefined &&
    (documentLog.cost == null || documentLog.cost < filters.costFrom)
  ) {
    return false;
  }

  if (
    filters?.costTo !== undefined &&
    (documentLog.cost == null || documentLog.cost > filters.costTo)
  ) {
    return false;
  }

  if (
    filters?.issuedAtFrom !== undefined &&
    (documentLog.issuedAt == null || documentLog.issuedAt < filters.issuedAtFrom)
  ) {
    return false;
  }

  if (
    filters?.issuedAtTo !== undefined &&
    (documentLog.issuedAt == null || documentLog.issuedAt > filters.issuedAtTo)
  ) {
    return false;
  }

  if (filters?.validFromFrom !== undefined && documentLog.validFrom < filters.validFromFrom) {
    return false;
  }

  if (filters?.validFromTo !== undefined && documentLog.validFrom > filters.validFromTo) {
    return false;
  }

  if (filters?.validToFrom !== undefined && documentLog.validTo < filters.validToFrom) {
    return false;
  }

  if (filters?.validToTo !== undefined && documentLog.validTo > filters.validToTo) {
    return false;
  }

  return true;
}
