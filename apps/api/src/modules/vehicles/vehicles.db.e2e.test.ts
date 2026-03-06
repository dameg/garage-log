import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../shared/testing/create-test-app';

describe('Vehicles (integration - in memory)', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST then GET vehicles', async () => {
    const postRes = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      payload: {
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
      },
    });

    expect(postRes.statusCode).toBe(201);

    const getRes = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
    });

    expect(getRes.statusCode).toBe(200);

    const list = getRes.json();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('E46');
  });

  it('validates body (400)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      payload: { name: '' },
    });

    expect(res.statusCode).toBe(400);
  });
});
