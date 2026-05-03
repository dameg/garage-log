import type { Document } from '@prisma/client';

import type { Document as DomainDocument } from '../../../domain/document';

export function toDomainDocument(row: Document): DomainDocument {
  return {
    id: row.id,
    ownerId: row.ownerId,
    vehicleId: row.vehicleId,
    type: row.type,
    title: row.title,
    issuer: row.issuer,
    validFrom: row.validFrom,
    validTo: row.validTo,
    issuedAt: row.issuedAt,
    cost: row.cost,
    note: row.note,
    createdAt: row.createdAt,
  };
}
