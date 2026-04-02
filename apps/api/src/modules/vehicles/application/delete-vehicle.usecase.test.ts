import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../../shared/errors/not-found-error';
import { VehicleDomainBuilder } from '../test/vehicle.domain.builder';
import { InMemoryVehicleRepository } from '../test/in-memory/in-memory-vehicle.repository';
import { createVehicle } from '../domain/vehicle';
import { DeleteVehicleUseCase } from './delete-vehicle.usecase';

describe('DeleteVehicleUseCase', () => {
  it('deletes vehicle for owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new DeleteVehicleUseCase(repo);

    const vehicle = createVehicle(
      new VehicleDomainBuilder().withId('v-1').withOwnerId('user-1').build(),
    );

    await repo.create(vehicle);

    await expect(
      useCase.execute({
        vehicleId: 'v-1',
        ownerId: 'user-1',
      }),
    ).resolves.toBeUndefined();

    const found = await repo.findByIdForOwner('v-1', 'user-1');
    expect(found).toBeNull();
  });

  it('throws when vehicle does not exist', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new DeleteVehicleUseCase(repo);

    await expect(
      useCase.execute({
        vehicleId: 'missing',
        ownerId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws when vehicle belongs to another owner', async () => {
    const repo = new InMemoryVehicleRepository();
    const useCase = new DeleteVehicleUseCase(repo);

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
