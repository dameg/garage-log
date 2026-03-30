import { describe, expect, it } from 'vitest';

import type { DocumentLog } from '../domain/document-log';
import type { DocumentLogListQuery } from '../domain/document-log-list.query';
import type { DocumentLogRepository } from '../domain/document-log.repository';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';
import { CreateDocumentLogUseCase } from './create-document-log.usecase';

describe('CreateDocumentLogUseCase', () => {
  it('creates a document log with a generated id', async () => {
    const createdAt = new Date('2025-01-02T00:00:00.000Z');
    let createdDocumentLog: DocumentLog | null = null;

    const repo: DocumentLogRepository = {
      async create(documentLog) {
        createdDocumentLog = documentLog;
        return { ...(documentLog as DocumentLog), createdAt };
      },
      async list(query: DocumentLogListQuery) {
        return {
          data: [],
          total: 0,
          page: query.page,
          limit: query.limit,
        };
      },
      async findByIdForOwner() {
        return null;
      },
      async deleteByIdForOwner() {
        return false;
      },
      async updateByIdForOwner() {
        return null;
      },
    };

    const useCase = new CreateDocumentLogUseCase(repo);
    const input = new DocumentLogDomainBuilder().build();

    const result = await useCase.execute({
      vehicleId: input.vehicleId,
      ownerId: input.ownerId,
      type: input.type,
      title: input.title,
      issuer: input.issuer,
      validFrom: input.validFrom,
      validTo: input.validTo,
      issuedAt: input.issuedAt,
      cost: input.cost,
      note: input.note,
    });

    expect(createdDocumentLog?.id).toBeDefined();
    expect(result.id).toBe(createdDocumentLog?.id);
    expect(result.vehicleId).toBe(input.vehicleId);
    expect(result.ownerId).toBe(input.ownerId);
    expect(result.type).toBe(input.type);
    expect(result.title).toBe(input.title);
    expect(result.issuer).toBe(input.issuer);
    expect(result.validFrom).toEqual(input.validFrom);
    expect(result.validTo).toEqual(input.validTo);
    expect(result.issuedAt).toEqual(input.issuedAt);
    expect(result.cost).toBe(input.cost);
    expect(result.note).toBe(input.note);
    expect(result.createdAt).toEqual(createdAt);
  });
});
