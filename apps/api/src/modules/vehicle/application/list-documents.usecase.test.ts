import { describe, expect, it } from 'vitest';

import { createDocument } from '../domain/document';
import { DocumentDomainBuilder } from '../test/document.domain.builder';
import { SpyDocumentRepository } from '../test/in-memory/spy-document.repository';

import { ListDocumentsUseCase } from './list-documents.usecase';

describe('ListDocumentsUseCase', () => {
  it('maps input into repository query with cursor', async () => {
    const repo = new SpyDocumentRepository();
    const useCase = new ListDocumentsUseCase(repo);
    const createdAt = new Date('2025-01-15T10:00:00.000Z');

    await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      createdAt,
      id: 'doc-1',
      limit: 5,
    });

    expect(repo.lastListQuery).toEqual({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      cursor: {
        createdAt,
        id: 'doc-1',
      },
      limit: 5,
    });
  });

  it('omits cursor when it is incomplete', async () => {
    const repo = new SpyDocumentRepository();
    const useCase = new ListDocumentsUseCase(repo);

    await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      createdAt: new Date('2025-01-15T10:00:00.000Z'),
      id: undefined,
      limit: 10,
    });

    expect(repo.lastListQuery).toEqual({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      cursor: undefined,
      limit: 10,
    });
  });

  it('returns repository result', async () => {
    const document = createDocument(
      new DocumentDomainBuilder()
        .withId('doc-1')
        .withOwnerId('user-1')
        .withVehicleId('vehicle-1')
        .build(),
    );

    const repo = new SpyDocumentRepository({
      listResult: {
        data: [document],
        nextCursor: {
          createdAt: document.createdAt,
          id: document.id,
        },
      },
    });

    const useCase = new ListDocumentsUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      createdAt: undefined,
      id: undefined,
      limit: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('doc-1');
    expect(result.nextCursor).toEqual({
      createdAt: document.createdAt,
      id: 'doc-1',
    });
  });
});
