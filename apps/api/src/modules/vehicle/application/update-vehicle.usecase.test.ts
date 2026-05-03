import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors';
import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../test/in-memory/in-memory-vehicle.repository';
import { VehicleDomainBuilder } from '../test/vehicle.domain.builder';

import { UpdateVehicleUseCase } from './update-vehicle.usecase';

describe('UpdateVehicleUseCase', () => {
  it('updates vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new UpdateVehicleUseCase(repo);

    const vehicle = createVehicle(
      new VehicleDomainBuilder().withId('v-1').withOwnerId('user-1').build(),
    );

    await repo.create(vehicle);

    const result = await useCase.execute({
      vehicleId: 'v-1',
      ownerId: 'user-1',
      patch: {
        vin: '4ALGYGW1H1YP26659',
        mileage: 260000,
      },
    });

    expect(result.id).toBe('v-1');
    expect(result.ownerId).toBe('user-1');
    expect(result.vin).toBe('4ALGYGW1H1YP26659');
    expect(result.brand).toBe('BMW');
    expect(result.model).toBe('330i');
    expect(result.year).toBe(2002);
    expect(result.mileage).toBe(260000);
  });

  it('throws when vehicle does not exist', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new UpdateVehicleUseCase(repo);

    await expect(
      useCase.execute({
        vehicleId: 'missing',
        ownerId: 'user-1',
        patch: {
          mileage: 260000,
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when vehicle belongs to another owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new UpdateVehicleUseCase(repo);

    const vehicle = createVehicle(
      new VehicleDomainBuilder().withId('v-1').withOwnerId('user-1').build(),
    );

    await repo.create(vehicle);

    await expect(
      useCase.execute({
        vehicleId: 'v-1',
        ownerId: 'user-2',
        patch: {
          mileage: 260000,
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
