import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildApp } from '../../app';
import { getPrisma } from '../../shared/db/prisma';
import { registerAndGetCookie } from '../../test/utils/auth';
import { VehicleHttpBuilder } from '../../test/builders/vehicle.http.builder';
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
} from '../../test/actions/vehicle.actions';

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
    const user = await registerAndGetCookie(app, 'user1@test.com');

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    expect(createRes.statusCode).toBe(201);

    const created = createRes.json();
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ownerId: expect.any(String),
        name: 'E46',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
        createdAt: expect.any(String),
      }),
    );

    const listRes = await listVehicles(app, user.cookie);

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();
    expect(list.data).toHaveLength(1);
    expect(list.total).toBe(1);
    expect(list.page).toBe(1);
    expect(list.limit).toBe(10);
    expect(list.data[0].id).toBe(created.id);
    expect(list.data[0].name).toBe('E46');
  });

  it('returns vehicle by id for owner', async () => {
    const user = await registerAndGetCookie(app, 'user2@test.com');

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const getRes = await getVehicle(app, user.cookie, created.id);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        ownerId: created.ownerId,
        name: 'E46',
      }),
    );
  });

  it('updates vehicle for owner', async () => {
    const user = await registerAndGetCookie(app, 'user3@test.com');

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const patchRes = await updateVehicle(app, user.cookie, created.id, {
      name: 'E46 Touring',
      mileage: 260000,
    });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        ownerId: created.ownerId,
        name: 'E46 Touring',
        mileage: 260000,
      }),
    );
  });

  it('deletes vehicle for owner', async () => {
    const user = await registerAndGetCookie(app, 'user4@test.com');

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const deleteRes = await deleteVehicle(app, user.cookie, created.id);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await getVehicle(app, user.cookie, created.id);
    expect(getRes.statusCode).toBe(404);
  });

  it('returns 400 for invalid create body', async () => {
    const user = await registerAndGetCookie(app, 'user5@test.com');

    const res = await createVehicle(
      app,
      user.cookie,
      new VehicleHttpBuilder().withName('').build(),
    );

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid patch body', async () => {
    const user = await registerAndGetCookie(app, 'user6@test.com');

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const res = await updateVehicle(app, user.cookie, created.id, {
      year: 'abc',
    } as any);

    expect(res.statusCode).toBe(400);
  });

  it('returns 401 when request has no auth cookie', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 404 when vehicle does not exist', async () => {
    const user = await registerAndGetCookie(app, 'user7@test.com');

    const res = await getVehicle(app, user.cookie, '00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(404);
  });

  it('does not show vehicles of another user', async () => {
    const owner = await registerAndGetCookie(app, 'owner@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger@test.com');

    await createVehicle(app, owner.cookie, new VehicleHttpBuilder().withName('E30').build());

    const listRes = await listVehicles(app, stranger.cookie);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data).toHaveLength(0);
    expect(listRes.json().total).toBe(0);
  });

  it('returns 404 when another user tries to fetch vehicle by id', async () => {
    const owner = await registerAndGetCookie(app, 'owner2@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger2@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const getRes = await getVehicle(app, stranger.cookie, created.id);

    expect(getRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to update vehicle', async () => {
    const owner = await registerAndGetCookie(app, 'owner3@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger3@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const patchRes = await updateVehicle(app, stranger.cookie, created.id, {
      name: 'Hacked',
    });

    expect(patchRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to delete vehicle', async () => {
    const owner = await registerAndGetCookie(app, 'owner4@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger4@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const deleteRes = await deleteVehicle(app, stranger.cookie, created.id);

    expect(deleteRes.statusCode).toBe(404);
  });
});
