import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../infrastructure/in-memory-vehicle.repository';
import { DeleteVehicleUseCase } from './delete-vehicle.usecase';

describe('DeleteVehicleUseCase', () => {
  it('deletes vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new DeleteVehicleUseCase(repo);

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

    await useCase.execute({
      id: 'v-1',
      ownerId: 'user-1',
    });

    const found = await repo.findByIdForOwner('v-1', 'user-1');
    expect(found).toBeNull();
  });

  it('throws not found when vehicle belongs to different owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new DeleteVehicleUseCase(repo);

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
