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

  it('passes optional fields to the repository unchanged apart from the generated id', async () => {
    let createdDocumentLog: DocumentLog | null = null;

    const repo: DocumentLogRepository = {
      async create(documentLog) {
        createdDocumentLog = documentLog;
        return documentLog;
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

    await useCase.execute({
      vehicleId: 'vehicle-1',
      ownerId: 'user-1',
      type: 'insurance',
      title: '  OC policy  ',
      issuer: '   ',
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      issuedAt: new Date('2024-12-15T00:00:00.000Z'),
      cost: 1299,
      note: '   ',
    });

    expect(createdDocumentLog).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        vehicleId: 'vehicle-1',
        ownerId: 'user-1',
        type: 'insurance',
        title: '  OC policy  ',
        issuer: '   ',
        validFrom: new Date('2025-01-01T00:00:00.000Z'),
        validTo: new Date('2025-12-31T00:00:00.000Z'),
        issuedAt: new Date('2024-12-15T00:00:00.000Z'),
        cost: 1299,
        note: '   ',
      }),
    );
  });

  it('propagates repository errors', async () => {
    const expectedError = new Error('repository failed');

    const repo: DocumentLogRepository = {
      async create() {
        throw expectedError;
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

    await expect(
      useCase.execute({
        vehicleId: 'vehicle-1',
        ownerId: 'user-1',
        type: 'insurance',
        title: 'OC policy',
        issuer: 'PZU',
        validFrom: new Date('2025-12-31T00:00:00.000Z'),
        validTo: new Date('2025-01-01T00:00:00.000Z'),
        issuedAt: new Date('2024-12-15T00:00:00.000Z'),
        cost: 1299,
        note: 'Annual renewal',
      }),
    ).rejects.toThrow(expectedError);
  });
});
