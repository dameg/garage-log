import { describe, expect, it } from 'vitest';

import { createDocumentLog } from '../domain/document-log';
import { DocumentLogDomainBuilder } from '../test/document-log.domain.builder';
import { SpyDocumentLogRepository } from '../test/in-memory/spy-document-log.repository';
import { ListDocumentLogsUseCase } from './list-document-logs.usecase';

describe('ListDocumentLogsUseCase', () => {
  it('maps input into repository query', async () => {
    const repo = new SpyDocumentLogRepository();
    const useCase = new ListDocumentLogsUseCase(repo);

    await useCase.execute({
      ownerId: 'user-1',
      search: 'policy',
      type: 'insurance',
      issuer: 'PZU',
      costFrom: 100,
      costTo: 2000,
      hasCost: true,
      issuedAtFrom: new Date('2024-01-01T00:00:00.000Z'),
      issuedAtTo: new Date('2024-12-31T00:00:00.000Z'),
      validFromFrom: new Date('2025-01-01T00:00:00.000Z'),
      validFromTo: new Date('2025-06-30T00:00:00.000Z'),
      validToFrom: new Date('2025-07-01T00:00:00.000Z'),
      validToTo: new Date('2025-12-31T00:00:00.000Z'),
      sortBy: 'validTo',
      direction: 'asc',
      page: 2,
      limit: 5,
    });

    expect(repo.lastListQuery).toEqual({
      ownerId: 'user-1',
      filters: {
        search: 'policy',
        type: 'insurance',
        issuer: 'PZU',
        costFrom: 100,
        costTo: 2000,
        hasCost: true,
        issuedAtFrom: new Date('2024-01-01T00:00:00.000Z'),
        issuedAtTo: new Date('2024-12-31T00:00:00.000Z'),
        validFromFrom: new Date('2025-01-01T00:00:00.000Z'),
        validFromTo: new Date('2025-06-30T00:00:00.000Z'),
        validToFrom: new Date('2025-07-01T00:00:00.000Z'),
        validToTo: new Date('2025-12-31T00:00:00.000Z'),
      },
      sort: {
        field: 'validTo',
        direction: 'asc',
      },
      page: 2,
      limit: 5,
    });
  });

  it('returns document logs from repository', async () => {
    const documentLog = createDocumentLog(
      new DocumentLogDomainBuilder().withId('doc-1').withOwnerId('user-1').build(),
    );
    const repo = new SpyDocumentLogRepository({
      data: [documentLog],
      total: 1,
      page: 1,
      limit: 10,
    });
    const useCase = new ListDocumentLogsUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      search: undefined,
      type: undefined,
      issuer: undefined,
      costFrom: undefined,
      costTo: undefined,
      hasCost: undefined,
      issuedAtFrom: undefined,
      issuedAtTo: undefined,
      validFromFrom: undefined,
      validFromTo: undefined,
      validToFrom: undefined,
      validToTo: undefined,
      sortBy: 'createdAt',
      direction: 'desc',
      page: 1,
      limit: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.data[0].id).toBe('doc-1');
    expect(result.data[0].ownerId).toBe('user-1');
  });
});
