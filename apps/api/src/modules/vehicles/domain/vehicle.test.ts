import { describe, it, expect } from 'vitest';
import { createVehicle, updateVehicle } from './vehicle';

describe('createVehicle (domain)', () => {
  it('creates a vehicle and trims strings', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');

    const v = createVehicle({
      id: 'id-1',
      ownerId: 'user-1',
      name: '  E46  ',
      brand: ' BMW ',
      model: '  330i ',
      year: 2002,
      mileage: 250000,
      createdAt: now,
    });

    expect(v.id).toBe('id-1');
    expect(v.ownerId).toBe('user-1');
    expect(v.name).toBe('E46');
    expect(v.brand).toBe('BMW');
    expect(v.model).toBe('330i');
    expect(v.createdAt).toEqual(now);
  });

  it('rejects invalid year', () => {
    expect(() =>
      createVehicle({
        id: 'id-1',
        ownerId: 'user-1',
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 1700,
        mileage: 1,
      }),
    ).toThrow();
  });

  it('rejects negative mileage', () => {
    expect(() =>
      createVehicle({
        id: 'id-1',
        ownerId: 'user-1',
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: -1,
      }),
    ).toThrow();
  });

  it('rejects empty name after trim', () => {
    expect(() =>
      createVehicle({
        id: 'id-1',
        ownerId: 'user-1',
        name: '   ',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 0,
      }),
    ).toThrow();
  });
});

describe('updateVehicle (domain)', () => {
  it('updates only provided fields', () => {
    const vehicle = createVehicle({
      id: 'id-1',
      ownerId: 'user-1',
      name: 'E46',
      brand: 'BMW',
      model: '330i',
      year: 2002,
      mileage: 250000,
    });

    const updated = updateVehicle(vehicle, {
      mileage: 260000,
    });

    expect(updated.mileage).toBe(260000);
    expect(updated.name).toBe('E46');
    expect(updated.brand).toBe('BMW');
  });

  it('trims updated string fields', () => {
    const vehicle = createVehicle({
      id: 'id-1',
      ownerId: 'user-1',
      name: 'E46',
      brand: 'BMW',
      model: '330i',
      year: 2002,
      mileage: 250000,
    });

    const updated = updateVehicle(vehicle, {
      name: '  E46 Touring  ',
    });

    expect(updated.name).toBe('E46 Touring');
  });

  it('rejects invalid year in patch', () => {
    const vehicle = createVehicle({
      id: 'id-1',
      ownerId: 'user-1',
      name: 'E46',
      brand: 'BMW',
      model: '330i',
      year: 2002,
      mileage: 250000,
    });

    expect(() =>
      updateVehicle(vehicle, {
        year: 1700,
      }),
    ).toThrow();
  });

  it('does not change id or ownerId', () => {
    const vehicle = createVehicle({
      id: 'id-1',
      ownerId: 'user-1',
      name: 'E46',
      brand: 'BMW',
      model: '330i',
      year: 2002,
      mileage: 250000,
    });

    const updated = updateVehicle(vehicle, {
      name: 'E46 Touring',
    });

    expect(updated.id).toBe('id-1');
    expect(updated.ownerId).toBe('user-1');
  });
});
