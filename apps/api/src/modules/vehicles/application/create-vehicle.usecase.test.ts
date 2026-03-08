import { describe, expect, it } from 'vitest';

import { InMemoryVehicleRepository } from '../infrastructure/in-memory-vehicle.repository';
import { CreateVehicleUseCase } from './create-vehicle.usecase';

describe('CreateVehicleUseCase', () => {
  it('creates vehicle for owner and normalizes fields', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new CreateVehicleUseCase(repo);

    const created = await useCase.execute({
      ownerId: 'user-1',
      name: '  E46  ',
      brand: ' BMW ',
      model: ' 330i ',
      year: 2002,
      mileage: 250000,
    });

    expect(created.id).toBeDefined();
    expect(created.ownerId).toBe('user-1');
    expect(created.name).toBe('E46');
    expect(created.brand).toBe('BMW');
    expect(created.model).toBe('330i');
    expect(created.year).toBe(2002);
    expect(created.mileage).toBe(250000);
    expect(created.createdAt).toBeInstanceOf(Date);
  });
});
