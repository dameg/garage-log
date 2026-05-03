import type { PrismaClient } from '@prisma/client';

import type { DocumentRepository } from '../../contracts/document.repository';
import type { DocumentCursor, DocumentsListQuery } from '../../contracts/document-list.query';
import type { Document, UpdatableDocumentFields } from '../../domain/document';

import { toDomainDocument } from './mappers/to-domain-document';

import type { CursorResult } from '@/shared/contracts';

export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(document: Document): Promise<Document> {
    const created = await this.prisma.document.create({
      data: {
        id: document.id,
        vehicleId: document.vehicleId,
        ownerId: document.ownerId,
        type: document.type,
        title: document.title,
        issuer: document.issuer,
        validFrom: document.validFrom,
        validTo: document.validTo,
        issuedAt: document.issuedAt,
        cost: document.cost,
        note: document.note,
        createdAt: document.createdAt,
      },
    });
    return toDomainDocument(created);
  }

  async list(query: DocumentsListQuery): Promise<CursorResult<Document, DocumentCursor>> {
    const rows = await this.prisma.document.findMany({
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

    const domainRows = rows.map(toDomainDocument);
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
  ): Promise<Document | null> {
    const row = await this.prisma.document.findFirst({
      where: { id, ownerId, vehicleId },
    });

    return row ? toDomainDocument(row) : null;
  }

  async deleteByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
  ): Promise<boolean> {
    const deleted = await this.prisma.document.deleteMany({
      where: { id, ownerId, vehicleId },
    });
    return deleted.count > 0;
  }

  async updateByIdForOwnerAndVehicle(
    id: string,
    ownerId: string,
    vehicleId: string,
    data: UpdatableDocumentFields,
  ): Promise<Document | null> {
    const result = await this.prisma.document.updateMany({
      where: { id, ownerId, vehicleId },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    const updated = await this.prisma.document.findFirst({
      where: { id, ownerId, vehicleId },
    });

    return updated ? toDomainDocument(updated) : null;
  }
}
