import { describe, it, expect } from 'vitest';
import { ListVehicleUseCase } from './list-vehicle.usecase';
import { SpyVehicleRepository } from '../../../test/doubles/in-memory/spy-vehicle.repository';
import { createVehicle } from '../domain/vehicle';
import { VehicleDomainBuilder } from '../../../test/builders/vehicle.domain.builder';

describe('ListVehicleUseCase', () => {
  it('maps input into repository query', async () => {
    const repo = new SpyVehicleRepository();
    const useCase = new ListVehicleUseCase(repo);

    await useCase.execute({
      ownerId: 'user-1',
      search: 'BMW',
      mileageFrom: 100000,
      mileageTo: 300000,
      yearFrom: 1998,
      yearTo: 2020,
      sortBy: 'year',
      direction: 'desc',
      page: 2,
      limit: 5,
    });

    expect(repo.lastListQuery).toEqual({
      ownerId: 'user-1',
      filters: {
        search: 'BMW',
        mileageFrom: 100000,
        mileageTo: 300000,
        yearFrom: 1998,
        yearTo: 2020,
      },
      sort: {
        field: 'year',
        direction: 'desc',
      },
      page: 2,
      limit: 5,
    });
  });

  it('returns vehicles from repository', async () => {
    const vehicle = createVehicle(
      new VehicleDomainBuilder()
        .withId('v-1')
        .withOwnerId('user-1')
        .withVin('7PB4MVCXD3PR45211')
        .build(),
    );

    const repo = new SpyVehicleRepository({
      data: [vehicle],
      total: 1,
      page: 1,
      limit: 10,
    });

    const useCase = new ListVehicleUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'user-1',
      search: undefined,
      mileageFrom: undefined,
      mileageTo: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      sortBy: 'createdAt',
      direction: 'desc',
      page: 1,
      limit: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.data[0].id).toBe('v-1');
    expect(result.data[0].ownerId).toBe('user-1');
  });

  it('passes empty optional filters as undefined', async () => {
    const repo = new SpyVehicleRepository();
    const useCase = new ListVehicleUseCase(repo as any);

    await useCase.execute({
      ownerId: 'user-1',
      search: undefined,
      mileageFrom: undefined,
      mileageTo: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      sortBy: 'createdAt',
      direction: 'desc',
      page: 1,
      limit: 10,
    });

    expect(repo.lastListQuery).toEqual({
      ownerId: 'user-1',
      filters: {
        search: undefined,
        mileageFrom: undefined,
        mileageTo: undefined,
        yearFrom: undefined,
        yearTo: undefined,
      },
      sort: {
        field: 'createdAt',
        direction: 'desc',
      },
      page: 1,
      limit: 10,
    });
  });
});
