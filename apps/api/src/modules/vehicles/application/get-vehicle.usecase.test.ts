import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../infrastructure/in-memory-vehicle.repository';
import { GetVehicleUseCase } from './get-vehicle.usecase';

describe('GetVehicleUseCase', () => {
  it('returns vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new GetVehicleUseCase(repo);

    await repo.create(
      createVehicle({
        id: 'v-1',
        ownerId: 'user-1',
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
      }),
    );

    const result = await useCase.execute({
      id: 'v-1',
      ownerId: 'user-1',
    });

    expect(result.id).toBe('v-1');
    expect(result.ownerId).toBe('user-1');
  });

  it('throws not found when vehicle belongs to different owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new GetVehicleUseCase(repo);

    await repo.create(
      createVehicle({
        id: 'v-1',
        ownerId: 'user-1',
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
      }),
    );

    await expect(
      useCase.execute({
        id: 'v-1',
        ownerId: 'user-2',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
