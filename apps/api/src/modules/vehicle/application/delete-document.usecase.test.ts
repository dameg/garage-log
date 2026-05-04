import { describe, expect, it } from 'vitest';

import { createDocument } from '../domain/document';
import { DocumentDomainBuilder } from '../test/document.domain.builder';
import { InMemoryDocumentRepository } from '../test/in-memory/in-memory-document.repository';

import { DeleteDocumentUseCase } from './delete-document.usecase';

import { NotFoundError } from '@/shared/errors';

describe('DeleteDocumentUseCase', () => {
  it('deletes document for owner and vehicle', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new DeleteDocumentUseCase(repo);
    const document = createDocument(
      new DocumentDomainBuilder()
        .withId('doc-1')
        .withOwnerId('user-1')
        .withVehicleId('vehicle-1')
        .build(),
    );

    await repo.create(document);

    await expect(
      useCase.execute({
        documentId: 'doc-1',
        ownerId: 'user-1',
        vehicleId: 'vehicle-1',
      }),
    ).resolves.toBeUndefined();

    await expect(repo.findByIdForOwnerAndVehicle('doc-1', 'user-1', 'vehicle-1')).resolves.toBeNull();
  });

  it('throws when document does not exist', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new DeleteDocumentUseCase(repo);

    await expect(
      useCase.execute({
        documentId: 'missing',
        ownerId: 'user-1',
        vehicleId: 'vehicle-1',
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
