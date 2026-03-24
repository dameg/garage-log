import { DocumentLog } from '../../../domain/document-log';
import type { DocumentLog as PrismaDocumentLog } from '@prisma/client';

export function toDomainDocumentLog(row: PrismaDocumentLog): DocumentLog {
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
