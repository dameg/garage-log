import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { getPrisma } from '../db/prisma';
import { registerAndGetCookie } from '../testing/register-and-get-cookie';
import { resetDb } from '../testing/reset-db';

import { buildApp } from '@/app';
import { listVehicles } from '@/modules/vehicle/test/actions/vehicle.actions';

describe('Rate limit (db e2e)', () => {
  const prisma = getPrisma();
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('rate-limits repeated failed login attempts', async () => {
    const email = `login-rate-limit-${Date.now()}@test.com`;
    const remoteAddress = '10.0.0.1';

    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await app.inject({
        method: 'POST',
        remoteAddress,
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
      remoteAddress,
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

  it('keeps login rate limits isolated per email and ip subject', async () => {
    const limitedEmail = `limited-${Date.now()}@test.com`;
    const freshEmail = `fresh-${Date.now()}@test.com`;
    const remoteAddress = '10.0.0.2';

    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await app.inject({
        method: 'POST',
        remoteAddress,
        url: '/api/auth/login',
        payload: {
          email: limitedEmail,
          password: 'wrong-password',
        },
      });

      expect(res.statusCode).toBe(401);
    }

    const limitedRes = await app.inject({
      method: 'POST',
      remoteAddress,
      url: '/api/auth/login',
      payload: {
        email: limitedEmail,
        password: 'wrong-password',
      },
    });
    const freshRes = await app.inject({
      method: 'POST',
      remoteAddress,
      url: '/api/auth/login',
      payload: {
        email: freshEmail,
        password: 'wrong-password',
      },
    });

    expect(limitedRes.statusCode).toBe(429);
    expect(freshRes.statusCode).toBe(401);
  });

  it('keeps token bucket limits isolated per authenticated user', async () => {
    const limitedUser = await registerAndGetCookie(app, `api-rate-limit-a-${Date.now()}@test.com`);
    const freshUser = await registerAndGetCookie(app, `api-rate-limit-b-${Date.now()}@test.com`);

    for (let attempt = 0; attempt < 60; attempt++) {
      const res = await listVehicles(app, limitedUser.cookie);
      expect(res.statusCode).toBe(200);
    }

    const limitedRes = await listVehicles(app, limitedUser.cookie);
    const freshRes = await listVehicles(app, freshUser.cookie);

    expect(limitedRes.statusCode).toBe(429);
    expect(limitedRes.headers['retry-after']).toBeTruthy();
    expect(limitedRes.json()).toEqual(
      expect.objectContaining({
        error: 'Too Many Requests',
      }),
    );
    expect(freshRes.statusCode).toBe(200);
  });
});
