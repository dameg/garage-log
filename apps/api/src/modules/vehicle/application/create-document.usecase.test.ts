import { describe, expect, it } from 'vitest';

import { InMemoryDocumentRepository } from '../test/in-memory/in-memory-document.repository';

import { CreateDocumentUseCase } from './create-document.usecase';

describe('CreateDocumentUseCase', () => {
  it('creates document for owner and vehicle', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new CreateDocumentUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      type: 'insurance',
      title: 'OC policy',
      issuer: 'PZU',
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      issuedAt: new Date('2024-12-15T00:00:00.000Z'),
      cost: 1299,
      note: 'Annual renewal',
    });

    expect(result.id).toBeDefined();
    expect(result.ownerId).toBe('user-1');
    expect(result.vehicleId).toBe('vehicle-1');
    expect(result.title).toBe('OC policy');
    expect(result.createdAt).toBeInstanceOf(Date);
    await expect(
      repo.findByIdForOwnerAndVehicle(result.id, 'user-1', 'vehicle-1'),
    ).resolves.toEqual(result);
  });

  it('maps optional undefined fields to null', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new CreateDocumentUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      type: 'insurance',
      title: 'OC policy',
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      issuer: undefined,
      issuedAt: undefined,
      cost: undefined,
      note: undefined,
    });

    expect(result.issuer).toBeNull();
    expect(result.issuedAt).toBeNull();
    expect(result.cost).toBeNull();
    expect(result.note).toBeNull();
  });

  it('uses domain normalization before saving', async () => {
    const repo = new InMemoryDocumentRepository();
    const useCase = new CreateDocumentUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      vehicleId: 'vehicle-1',
      type: 'insurance',
      title: '  OC policy  ',
      issuer: '   ',
      validFrom: new Date('2025-01-01T00:00:00.000Z'),
      validTo: new Date('2025-12-31T00:00:00.000Z'),
      issuedAt: new Date('2024-12-15T00:00:00.000Z'),
      cost: 1299,
      note: '  paid yearly  ',
    });

    expect(result.title).toBe('OC policy');
    expect(result.issuer).toBeNull();
    expect(result.note).toBe('paid yearly');
  });
});
