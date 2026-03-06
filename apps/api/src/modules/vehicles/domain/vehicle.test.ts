import { describe, it, expect } from 'vitest';
import { createVehicle } from './vehicle';

describe('createVehicle (domain)', () => {
  it('creates a vehicle and trims strings', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');

    const v = createVehicle({
      id: 'id-1',
      name: '  E46  ',
      brand: ' BMW ',
      model: '  330i ',
      year: 2002,
      mileage: 250000,
      createdAt: now,
    });

    expect(v.id).toBe('id-1');
    expect(v.name).toBe('E46');
    expect(v.brand).toBe('BMW');
    expect(v.model).toBe('330i');
    expect(v.createdAt).toEqual(now);
  });

  it('rejects invalid year', () => {
    expect(() =>
      createVehicle({
        id: 'id-1',
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
        name: '   ',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 0,
      }),
    ).toThrow();
  });
});
