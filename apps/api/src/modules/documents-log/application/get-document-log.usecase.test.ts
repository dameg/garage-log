import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createDocumentLog } from '../domain/document-log';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';
import { InMemoryDocumentLogRepository } from '../test/in-memory/in-memory-document-log.repository';
import { GetDocumentLogUseCase } from './get-document-log.usecase';

describe('GetDocumentLogUseCase', () => {
  it('returns document log for owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new GetDocumentLogUseCase(repo);
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    await repo.create(documentLog);

    const result = await useCase.execute({
      documentLogId: 'doc-1',
      ownerId: 'user-1',
    });

    expect(result.id).toBe('doc-1');
    expect(result.ownerId).toBe('user-1');
  });

  it('throws when document log does not exist', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new GetDocumentLogUseCase(repo);

    await expect(
      useCase.execute({
        documentLogId: 'missing',
        ownerId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when document log belongs to another owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new GetDocumentLogUseCase(repo);
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
