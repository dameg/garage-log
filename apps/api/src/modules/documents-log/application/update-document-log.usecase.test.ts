import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createDocumentLog } from '../domain/document-log';
import type { DocumentLogListQuery } from '../domain/document-log-list.query';
import type { DocumentLogRepository } from '../domain/document-log.repository';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';
import { InMemoryDocumentLogRepository } from '../test/in-memory/in-memory-document-log.repository';
import { UpdateDocumentLogUseCase } from './update-document-log.usecase';

describe('UpdateDocumentLogUseCase', () => {
  it('updates document log for owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new UpdateDocumentLogUseCase(repo);
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    await repo.create(documentLog);

    const result = await useCase.execute({
      documentLogId: 'doc-1',
      ownerId: 'user-1',
      patch: {
        title: '  Extended policy  ',
        note: '   ',
        cost: 1500,
      },
    });

    expect(result.id).toBe('doc-1');
    expect(result.ownerId).toBe('user-1');
    expect(result.title).toBe('Extended policy');
    expect(result.note).toBeNull();
    expect(result.cost).toBe(1500);
    expect(result.type).toBe(documentLog.type);
    expect(result.validFrom).toEqual(documentLog.validFrom);
    expect(result.validTo).toEqual(documentLog.validTo);
  });

  it('throws when document log does not exist', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new UpdateDocumentLogUseCase(repo);

    await expect(
      useCase.execute({
        documentLogId: 'missing',
        ownerId: 'user-1',
        patch: {
          title: 'Updated title',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when document log belongs to another owner', async () => {
    const repo = new InMemoryDocumentLogRepository();
    const useCase = new UpdateDocumentLogUseCase(repo);
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    await repo.create(documentLog);

    await expect(
      useCase.execute({
        documentLogId: 'doc-1',
        ownerId: 'user-2',
        patch: {
          title: 'Updated title',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when document log is not updated after being loaded', async () => {
    const existing = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );

    const repo: DocumentLogRepository = {
      async create(documentLog) {
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
      async findByIdForOwner(documentLogId, ownerId) {
        if (documentLogId === existing.id && ownerId === existing.ownerId) {
          return existing;
        }

        return null;
      },
      async deleteByIdForOwner() {
        return false;
      },
      async updateByIdForOwner() {
        return null;
      },
    };

    const useCase = new UpdateDocumentLogUseCase(repo);

    await expect(
      useCase.execute({
        documentLogId: 'doc-1',
        ownerId: 'user-1',
        patch: {
          title: 'Updated title',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
