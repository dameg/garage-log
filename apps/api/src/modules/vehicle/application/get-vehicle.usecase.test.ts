import { describe, expect, it } from 'vitest';

import { createVehicle } from '../domain/vehicle';
import { InMemoryVehicleRepository } from '../test/in-memory/in-memory-vehicle.repository';
import { VehicleDomainBuilder } from '../test/vehicle.domain.builder';

import { GetVehicleUseCase } from './get-vehicle.usecase';

import { NotFoundError } from '@/shared/errors';

describe('GetVehicleUseCase', () => {
  it('returns vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new GetVehicleUseCase(repo);
    const input = new VehicleDomainBuilder().withId('v-1').withOwnerId('user-1').build();
    const vehicle = createVehicle(input);

    await repo.create(vehicle);

    const result = await useCase.execute({
      vehicleId: 'v-1',
      ownerId: 'user-1',
    });

    expect(result.id).toBe('v-1');
    expect(result.ownerId).toBe('user-1');
  });

  it('throws when vehicle does not exist', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new GetVehicleUseCase(repo);

    await expect(
      useCase.execute({
        vehicleId: 'missing-1',
        ownerId: 'missing-2',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when vehicle belongs to another owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new GetVehicleUseCase(repo);

    const vehicle = createVehicle(
      new VehicleDomainBuilder().withId('v-1').withOwnerId('user-1').build(),
    );

    await repo.create(vehicle);

    await expect(
      useCase.execute({
        vehicleId: 'v-1',
        ownerId: 'user-2',
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
