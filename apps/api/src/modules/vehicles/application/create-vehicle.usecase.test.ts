import { describe, expect, it } from 'vitest';

import { CreateVehicleUseCase } from './create-vehicle.usecase';
import { InMemoryVehicleRepository } from '../../../test/doubles/in-memory/in-memory-vehicle.repository';

describe('CreateVehicleUseCase', () => {
  it('creates vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new CreateVehicleUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      vin: '7PB4MVCXD3PR45211',
      brand: 'BMW',
      model: '330i',
      year: 2002,
      mileage: 250000,
    });

    expect(result.id).toBeDefined();
    expect(result.ownerId).toBe('user-1');
    expect(result.vin).toBe('7PB4MVCXD3PR45211');
    expect(result.brand).toBe('BMW');
    expect(result.model).toBe('330i');
    expect(result.year).toBe(2002);
    expect(result.mileage).toBe(250000);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
