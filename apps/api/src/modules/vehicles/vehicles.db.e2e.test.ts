import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../../app';
import { getPrisma } from '../../shared/db/prisma';
import { registerAndGetCookie } from '../../test/utils/auth';

describe('Vehicles (db e2e)', () => {
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

  it('creates and lists vehicles only for authenticated owner', async () => {
    const cookie = await registerAndGetCookie(app, 'user1@test.com');

    const postRes = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      headers: {
        cookie,
      },
      payload: {
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
      },
    });

    expect(postRes.statusCode).toBe(201);

    const created = postRes.json();
    expect(created.id).toBeDefined();
    expect(created.ownerId).toBeDefined();

    const getRes = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
      headers: {
        cookie,
      },
    });

    expect(getRes.statusCode).toBe(200);

    const list = getRes.json();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('E46');
  });

  it('does not show vehicles of another user', async () => {
    const user1Cookie = await registerAndGetCookie(app, 'user1@test.com');
    const user2Cookie = await registerAndGetCookie(app, 'user2@test.com');

    const postRes = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      headers: {
        cookie: user1Cookie,
      },
      payload: {
        name: 'E30',
        brand: 'BMW',
        model: '325i',
        year: 1989,
        mileage: 300000,
      },
    });

    expect(postRes.statusCode).toBe(201);

    const listRes = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
      headers: {
        cookie: user2Cookie,
      },
    });

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();
    expect(list).toHaveLength(0);
  });

  it('returns 404 when another user tries to fetch vehicle by id', async () => {
    const user1Cookie = await registerAndGetCookie(app, 'user1@test.com');
    const user2Cookie = await registerAndGetCookie(app, 'user2@test.com');

    const postRes = await app.inject({
      method: 'POST',
      url: '/api/vehicles',
      headers: {
        cookie: user1Cookie,
      },
      payload: {
        name: 'E36',
        brand: 'BMW',
        model: '328i',
        year: 1998,
        mileage: 220000,
      },
    });

    const created = postRes.json();

    const getRes = await app.inject({
      method: 'GET',
      url: `/api/vehicles/${created.id}`,
      headers: {
        cookie: user2Cookie,
      },
    });

    expect(getRes.statusCode).toBe(404);
  });

  it('returns 401 when request has no auth cookie', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
    });

    expect(res.statusCode).toBe(401);
  });
});
