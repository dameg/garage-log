import { describe, expect,it } from 'vitest';

import { DomainError } from '../../../shared/errors';
import { VehicleDomainBuilder } from '../test/vehicle.domain.builder';

import { createVehicle, updateVehicle } from './vehicle';

describe('createVehicle (domain)', () => {
  it('creates a vehicle and trims string fields', () => {
    const input = new VehicleDomainBuilder()
      .withVin('7PB4MVCXD3PR45211')
      .withBrand(' BMW ')
      .withModel('  330i ')
      .build();
    const vehicle = createVehicle(input);

    expect(vehicle.vin).toBe('7PB4MVCXD3PR45211');
    expect(vehicle.brand).toBe('BMW');
    expect(vehicle.model).toBe('330i');
    expect(vehicle.year).toBe(2002);
    expect(vehicle.mileage).toBe(250000);
  });

  it('rejects empty vin after trim', () => {
    const input = new VehicleDomainBuilder().withVin('   ').build();

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
    expect(updated.vin).toBe('7PB4MVCXD3PR45211');
    expect(updated.brand).toBe('BMW');
    expect(updated.model).toBe('330i');
    expect(updated.year).toBe(2002);
    expect(updated.mileage).toBe(260000);
  });

  it('keeps immutable fields unchanged', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    const updated = updateVehicle(vehicle, {
      vin: '4ALGYGW1H1YP26659',
    });

    expect(updated.id).toBe(vehicle.id);
    expect(updated.ownerId).toBe(vehicle.ownerId);
    expect(updated.createdAt).toEqual(vehicle.createdAt);
  });

  it('trims updated string fields', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    const updated = updateVehicle(vehicle, {
      vin: '  7PB4MVCXD3PR45211  ',
      brand: '  BMW  ',
      model: '  330Ci  ',
    });

    expect(updated.vin).toBe('7PB4MVCXD3PR45211');
    expect(updated.brand).toBe('BMW');
    expect(updated.model).toBe('330Ci');
  });

  it('rejects empty updated vin after trim', () => {
    const input = new VehicleDomainBuilder().build();
    const vehicle = createVehicle(input);

    expect(() =>
      updateVehicle(vehicle, {
        vin: '   ',
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
