import { describe, expect, it } from 'vitest';

import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../infrastructure/in-memory-vehicle.repository';
import { ListVehiclesUseCase } from './list-vehicles.usecase';

describe('ListVehiclesUseCase', () => {
  it('returns only vehicles for given owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new ListVehiclesUseCase(repo);

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

    await repo.create(
      createVehicle({
        id: 'v-2',
        ownerId: 'user-2',
        name: 'Civic',
        brand: 'Honda',
        model: 'Type R',
        year: 2019,
        mileage: 100000,
      }),
    );

    const result = await useCase.execute({
      ownerId: 'user-1',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('v-1');
    expect(result[0].ownerId).toBe('user-1');
  });
});
