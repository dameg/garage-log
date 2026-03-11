import { describe, it, expect } from 'vitest';
import { createVehicle, updateVehicle } from './vehicle';
import { VehicleDomainBuilder } from '../../../test/builders/vehicle.domain.builder';
import { DomainError } from '../../../shared/errors/domain-error';

describe('createVehicle (domain)', () => {
  it('creates a vehicle and trims string fields', () => {
    const input = new VehicleDomainBuilder()
      .withName(' E46 ')
      .withBrand(' BMW ')
      .withModel('  330i ')
      .build();
    const vehicle = createVehicle(input);

    expect(vehicle.name).toBe('E46');
    expect(vehicle.brand).toBe('BMW');
    expect(vehicle.model).toBe('330i');
    expect(vehicle.year).toBe(2002);
    expect(vehicle.mileage).toBe(250000);
  });

  it('rejects empty name after trim', () => {
    const input = new VehicleDomainBuilder().withName('   ').build();

    expect(() => createVehicle(input)).toThrow(DomainError);
  });

  it('rejects empty brand after trim', () => {
    const input = new VehicleDomainBuilder().withBrand('   ').build();

    expect(() => createVehicle(input)).toThrow(DomainError);
  });

  it('rejects empty model after trim', () => {
    const input = new VehicleDomainBuilder().withModel('   ').build();

    expect(() => createVehicle(input)).toThrow(DomainError);
  });

  it('rejects invalid year', () => {
    const input = new VehicleDomainBuilder().withYear(1700).build();
    expect(() => createVehicle(input)).toThrow(DomainError);
  });

  it('rejects negative mileage', () => {
    const input = new VehicleDomainBuilder().withMileage(-1).build();

    expect(() => createVehicle(input)).toThrow(DomainError);
  });

  it('sets createdAt on create', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(vehicle.createdAt).toBeInstanceOf(Date);
  });
});

describe('updateVehicle (domain)', () => {
  it('updates only provided fields', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);
    const updated = updateVehicle(vehicle, {
      mileage: 260000,
    });

    expect(updated.id).toBe(vehicle.id);
    expect(updated.ownerId).toBe(vehicle.ownerId);
    expect(updated.name).toBe('E46');
    expect(updated.brand).toBe('BMW');
    expect(updated.model).toBe('330i');
    expect(updated.year).toBe(2002);
    expect(updated.mileage).toBe(260000);
  });

  it('keeps immutable fields unchanged', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    const updated = updateVehicle(vehicle, {
      name: 'E46 Touring',
    });

    expect(updated.id).toBe(vehicle.id);
    expect(updated.ownerId).toBe(vehicle.ownerId);
    expect(updated.createdAt).toEqual(vehicle.createdAt);
  });

  it('trims updated string fields', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    const updated = updateVehicle(vehicle, {
      name: '  E46 Touring  ',
      brand: '  BMW  ',
      model: '  330Ci  ',
    });

    expect(updated.name).toBe('E46 Touring');
    expect(updated.brand).toBe('BMW');
    expect(updated.model).toBe('330Ci');
  });

  it('rejects empty updated name after trim', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        name: '   ',
      }),
    ).toThrow(DomainError);
  });

  it('rejects empty updated brand after trim', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        brand: '   ',
      }),
    ).toThrow(DomainError);
  });

  it('rejects empty updated model after trim', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        model: '   ',
      }),
    ).toThrow(DomainError);
  });

  it('rejects invalid year in patch', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        year: 1700,
      }),
    ).toThrow(DomainError);
  });

  it('rejects invalid mileage in patch', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        mileage: -1,
      }),
    ).toThrow(DomainError);
  });
});
