import type { PrismaClient } from '@prisma/client';
import type { DocumentLogRepository } from '../../domain/document-log.repository';
import type { PaginatedResult } from '../../../../shared/domain/paginated-result';
import type { DocumentLog, UpdatableDocumentLogFields } from '../../domain/document-log';
import type { DocumentLogListQuery } from '../../domain/document-log-list.query';
import { toDomainDocumentLog } from './mappers/to-domain-document-log';
import { buildDocumentLogWhere } from './mappers/build-document-log-where';

export class PrismaDocumentLogRepository implements DocumentLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async list(query: DocumentLogListQuery): Promise<PaginatedResult<DocumentLog>> {
    const where = buildDocumentLogWhere(query);
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [rows, total] = await Promise.all([
      this.prisma.documentLog.findMany({
        where,
        skip,
        take,
        orderBy: {
          [query.sort.field]: query.sort.direction,
        },
      }),
      this.prisma.documentLog.count({
        where,
      }),
    ]);

    return {
      data: rows.map(toDomainDocumentLog),
      total,
      page: query.page,
      limit: query.limit,
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
