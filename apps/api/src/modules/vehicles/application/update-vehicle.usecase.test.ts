import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../infrastructure/in-memory-vehicle.repository';
import { UpdateVehicleUseCase } from './update-vehicle.usecase';

describe('UpdateVehicleUseCase', () => {
  it('updates vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new UpdateVehicleUseCase(repo);

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

    const updated = await useCase.execute({
      id: 'v-1',
      ownerId: 'user-1',
      patch: {
        name: '  E46 Touring ',
        mileage: 260000,
      },
    });

    expect(updated.name).toBe('E46 Touring');
    expect(updated.mileage).toBe(260000);
    expect(updated.brand).toBe('BMW');
    expect(updated.model).toBe('330i');
    expect(updated.year).toBe(2002);
    expect(updated.ownerId).toBe('user-1');
  });

  it('throws not found when vehicle belongs to different owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new UpdateVehicleUseCase(repo);

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
        patch: {
          name: 'E90',
        },
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
