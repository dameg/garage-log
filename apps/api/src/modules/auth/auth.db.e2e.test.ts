import { afterAll, beforeAll, beforeEach,describe, expect, it } from 'vitest';

import { getPrisma } from '@/shared/db';
import { createDbTestApp, resetDb } from '@/shared/testing';

describe('Auth (db e2e)', () => {
  const prisma = getPrisma();
  let testApp: Awaited<ReturnType<typeof createDbTestApp>>;
  let app: Awaited<ReturnType<typeof createDbTestApp>>['app'];

  beforeAll(async () => {
    testApp = await createDbTestApp();
    app = testApp.app;
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await testApp.close();
    await prisma.$disconnect();
  });

  it('registers user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'user@test.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(201);

    expect(res.json()).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          email: 'user@test.com',
        }),
      }),
    );
  });

  it('rejects duplicate email', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'user@test.com',
        password: 'password123',
      },
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'user@test.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(409);
  });

  it('logs user in and sets cookie', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'login@test.com',
        password: 'password123',
      },
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'login@test.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(200);

    const cookie = res.cookies.find((c) => c.name === 'access_token');
    expect(cookie).toBeTruthy();
  });

  it('rejects invalid credentials', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'missing@test.com',
        password: 'wrong-password',
      },
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns authenticated user via /me', async () => {
    const register = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'me@test.com',
        password: 'password123',
      },
    });

    const cookie = register.cookies.find((c) => c.name === 'access_token');

    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: `${cookie!.name}=${cookie!.value}`,
      },
    });

    expect(res.statusCode).toBe(200);

    expect(res.json()).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          email: 'me@test.com',
        }),
      }),
    );
  });

  it('returns 401 for /me without auth', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 401 for /me with invalid token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: 'access_token=invalid-token',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  });

  it('returns 401 for /me when token user no longer exists', async () => {
    const register = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'deleted-user@test.com',
        password: 'password123',
      },
    });

    const body = register.json();
    const cookie = register.cookies.find((c) => c.name === 'access_token');

    await prisma.user.delete({
      where: {
        id: body.user.id,
      },
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: `${cookie!.name}=${cookie!.value}`,
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({
      error: 'Unauthorized',
      message: 'Unauthorized',
    });
  });

  it('returns 400 for invalid register payload', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'not-an-email',
        password: '123',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({ path: 'email' }),
          expect.objectContaining({ path: 'password' }),
        ]),
      }),
    );
  });

  it('returns 400 for invalid login payload', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'not-an-email',
        password: '123',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({ path: 'email' }),
          expect.objectContaining({ path: 'password' }),
        ]),
      }),
    );
  });

  it('logs user out', async () => {
    const register = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'logout@test.com',
        password: 'password123',
      },
    });

    const cookie = register.cookies.find((c) => c.name === 'access_token');

    const logout = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: {
        cookie: `${cookie!.name}=${cookie!.value}`,
      },
    });

    expect(logout.statusCode).toBe(204);
  });
});
