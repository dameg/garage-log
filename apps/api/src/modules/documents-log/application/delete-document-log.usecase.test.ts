import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createDocumentLog } from '../domain/document-log';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';
import { InMemoryDocumentLogRepository } from '../test/in-memory/in-memory-document-log.repository';
import { DeleteDocumentLogUseCase } from './delete-document-log.usecase';

describe('DeleteDocumentLogUseCase', () => {
  it('deletes document log for owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new DeleteDocumentLogUseCase(repo);
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    await repo.create(documentLog);

    await expect(
      useCase.execute({
        documentLogId: 'doc-1',
        ownerId: 'user-1',
      }),
    ).resolves.toBeUndefined();

    const found = await repo.findByIdForOwner('doc-1', 'user-1');
    expect(found).toBeNull();
  });

  it('throws when document log does not exist', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new DeleteDocumentLogUseCase(repo);

    await expect(
      useCase.execute({
        documentLogId: 'missing',
        ownerId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when document log belongs to another owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new DeleteDocumentLogUseCase(repo);
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    await repo.create(documentLog);

    await expect(
      useCase.execute({
        documentLogId: 'doc-1',
        ownerId: 'user-2',
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
