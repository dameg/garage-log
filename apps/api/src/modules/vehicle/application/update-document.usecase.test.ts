import { describe, expect, it } from 'vitest';

import { createDocument } from '../domain/document';
import { DocumentDomainBuilder } from '../test/document.domain.builder';
import { InMemoryDocumentRepository } from '../test/in-memory/in-memory-document.repository';
import { SpyDocumentRepository } from '../test/in-memory/spy-document.repository';

import { UpdateDocumentUseCase } from './update-document.usecase';

import { NotFoundError } from '@/shared/errors';

describe('UpdateDocumentUseCase', () => {
  it('updates document for owner and vehicle', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new UpdateDocumentUseCase(repo);
    const existing = createDocument(
      new DocumentDomainBuilder()
        .withId('doc-1')
        .withOwnerId('user-1')
        .withVehicleId('vehicle-1')
        .build(),
    );

    await repo.create(existing);

    const result = await useCase.execute({
      documentId: 'doc-1',
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      patch: {
        title: '  Extended policy  ',
        issuer: '   ',
        note: '  paid monthly  ',
        cost: 1500,
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: 'doc-1',
        ownerId: 'user-1',
        vehicleId: 'vehicle-1',
        title: 'Extended policy',
        issuer: null,
        note: 'paid monthly',
        cost: 1500,
      }),
    );
    await expect(repo.findByIdForOwnerAndVehicle('doc-1', 'user-1', 'vehicle-1')).resolves.toEqual(
      result,
    );
  });

  it('throws when document does not exist before update', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new UpdateDocumentUseCase(repo);

    await expect(
      useCase.execute({
        documentId: 'missing',
        ownerId: 'user-1',
        vehicleId: 'vehicle-1',
        patch: {
          note: 'updated',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('maps normalized patch fields before sending update to repository', async () => {
    const existing = createDocument(
      new DocumentDomainBuilder()
        .withId('doc-1')
        .withOwnerId('user-1')
        .withVehicleId('vehicle-1')
        .build(),
    );
    const updated = {
      ...existing,
      title: 'Extended policy',
      issuer: null,
      note: 'paid monthly',
      cost: 1500,
    };
    const repo = new SpyDocumentRepository({ foundDocument: existing, updateResult: updated });
    const useCase = new UpdateDocumentUseCase(repo);

    await useCase.execute({
      documentId: 'doc-1',
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      patch: {
        title: '  Extended policy  ',
        issuer: '   ',
        note: '  paid monthly  ',
        cost: 1500,
      },
    });

    expect(repo.lastUpdateArgs).toEqual({
      id: 'doc-1',
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      patch: {
        type: existing.type,
        title: 'Extended policy',
        issuer: null,
        validFrom: existing.validFrom,
        validTo: existing.validTo,
        issuedAt: existing.issuedAt,
        cost: 1500,
        note: 'paid monthly',
      },
    });
  });
});
