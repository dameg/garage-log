import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../app';
import { getPrisma } from '../db/prisma';
import { registerAndGetCookie } from '../../test/utils/auth';
import { listVehicles } from '../../modules/vehicles/test/actions/vehicle.actions';

describe('Rate limit (db e2e)', () => {
  const prisma = getPrisma();
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('rate-limits repeated failed login attempts', async () => {
    const email = `login-rate-limit-${Date.now()}@test.com`;

    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email,
          password: 'wrong-password',
        },
      });

      expect(res.statusCode).toBe(401);
    }

    const limitedRes = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email,
        password: 'wrong-password',
      },
    });

    expect(limitedRes.statusCode).toBe(429);
    expect(limitedRes.headers['retry-after']).toBeTruthy();
    expect(limitedRes.json()).toEqual(
      expect.objectContaining({
        error: 'Too Many Requests',
      }),
    );
  });

  it('rate-limits authenticated API traffic after token bucket capacity is exhausted', async () => {
    const user = await registerAndGetCookie(app, `api-rate-limit-${Date.now()}@test.com`);

    for (let attempt = 0; attempt < 60; attempt++) {
      const res = await listVehicles(app, user.cookie);
      expect(res.statusCode).toBe(200);
    }

    const limitedRes = await listVehicles(app, user.cookie);

    expect(limitedRes.statusCode).toBe(429);
    expect(limitedRes.headers['retry-after']).toBeTruthy();
    expect(limitedRes.json()).toEqual(
      expect.objectContaining({
        error: 'Too Many Requests',
      }),
    );
  });
});
