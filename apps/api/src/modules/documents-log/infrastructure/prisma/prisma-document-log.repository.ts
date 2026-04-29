import type { PrismaClient } from '@prisma/client';

import type { CursorResult } from '../../../../shared/contracts/cursor-result';
import type { DocumentLogRepository } from '../../contracts/document-log.repository';
import type {
  DocumentLogCursor,
  DocumentLogListQuery,
} from '../../contracts/document-log-list.query';
import type { DocumentLog, UpdatableDocumentLogFields } from '../../domain/document-log';

import { toDomainDocumentLog } from './mappers/to-domain-document-log';

export class PrismaDocumentLogRepository implements DocumentLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private buildCursor(documentLog: DocumentLog): DocumentLogCursor {
    return {
      createdAt: documentLog.createdAt.toISOString(),
      id: documentLog.id,
    } as unknown as DocumentLogCursor;
  }

  async create(documentLog: DocumentLog): Promise<DocumentLog> {
    const created = await this.prisma.documentLog.create({
      data: {
        id: documentLog.id,
        vehicleId: documentLog.vehicleId,
        ownerId: documentLog.ownerId,
        type: documentLog.type,
        title: documentLog.title,
        issuer: documentLog.issuer,
        validFrom: documentLog.validFrom,
        validTo: documentLog.validTo,
        issuedAt: documentLog.issuedAt,
        cost: documentLog.cost,
        note: documentLog.note,
        createdAt: documentLog.createdAt,
      },
    });
    return toDomainDocumentLog(created);
  }

  async list(query: DocumentLogListQuery): Promise<CursorResult<DocumentLog, DocumentLogCursor>> {
    const rows = await this.prisma.documentLog.findMany({
      where: {
        ...(query.ownerId && { ownerId: query.ownerId }),
        ...(query.vehicleId && { vehicleId: query.vehicleId }),
        ...(query.cursor && {
          OR: [
            {
              createdAt: {
                lt: query.cursor.createdAt,
              },
            },
            {
              createdAt: query.cursor.createdAt,
              id: {
                lt: query.cursor.id,
              },
            },
          ],
        }),
      },
      take: query.limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const domainRows = rows.map(toDomainDocumentLog);
    const hasMore = domainRows.length > query.limit;
    const data = hasMore ? domainRows.slice(0, query.limit) : domainRows;
    const lastRow = data.at(-1);

    return {
      data,
      nextCursor: hasMore && lastRow ? { createdAt: lastRow.createdAt, id: lastRow.id } : null,
    };
  }

  async findByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<DocumentLog | null> {
    const row = await this.prisma.documentLog.findFirst({
      where: { id, ownerId, vehicleId },
    });

    return row ? toDomainDocumentLog(row) : null;
  }

  async deleteByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<boolean> {
    const deleted = await this.prisma.documentLog.deleteMany({
      where: { id, ownerId, vehicleId },
    });
    return deleted.count > 0;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    data: UpdatableDocumentLogFields,
  ): Promise<DocumentLog | null> {
    const result = await this.prisma.documentLog.updateMany({
      where: { id, ownerId, vehicleId },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    const updated = await this.prisma.documentLog.findFirst({
      where: { id, ownerId, vehicleId },
    });

    return updated ? toDomainDocumentLog(updated) : null;
  }
}
