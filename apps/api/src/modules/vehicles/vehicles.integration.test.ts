import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../app';
import { createTestDeps } from '../../shared/di/test';
import { registerAndGetCookie } from '../../test/utils/auth';

describe('Vehicles (integration - in memory)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => {
    app = await buildApp(createTestDeps());

    app.addHook('preHandler', async (req) => {
      req.user = { sub: 'test-user' } as any;
    });

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST then GET vehicles', async () => {
    const cookie = await registerAndGetCookie(app);

    const postRes = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      headers: {
        cookie,
      },
      payload: {
        ownerId: 'user-1',
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
      },
    });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.json().id).toBeDefined();

    const getRes = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
      headers: {
        cookie,
      },
    });

    expect(getRes.statusCode).toBe(200);

    const list = getRes.json() as Array<{ name: string }>;
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('E46');
  });

  it('validates body (400)', async () => {
    const cookie = await registerAndGetCookie(app);

    const res = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      headers: {
        cookie,
      },
      payload: { name: '' },
    });

    expect(res.statusCode).toBe(400);
  });
});
