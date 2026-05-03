import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
} from './test/actions/vehicle.actions';
import { VehicleHttpBuilder } from './test/vehicle.http.builder';

import { createTestApp } from '@/shared/testing';

describe('Vehicles (integration - in memory)', () => {
  let testApp: Awaited<ReturnType<typeof createTestApp>>;
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];

  beforeEach(async () => {
    testApp = await createTestApp();
    app = testApp.app;
  });

  afterEach(async () => {
    await testApp.close();
  });

  it('creates and lists vehicles for authenticated user', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    expect(createRes.statusCode).toBe(201);

    const created = createRes.json();
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ownerId: expect.any(String),
        vin: '7PB4MVCXD3PR45211',
        brand: 'BMW',
        model: '330i',
        year: 2002,
        mileage: 250000,
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
    expect(list.data[0].vin).toBe('7PB4MVCXD3PR45211');
  });

  it('returns vehicle by id', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const getRes = await getVehicle(app, user.cookie, created.id);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        vin: '7PB4MVCXD3PR45211',
      }),
    );
  });

  it('updates vehicle', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const patchRes = await updateVehicle(app, user.cookie, created.id, {
      mileage: 260000,
      vin: '4ALGYGW1H1YP26659',
    });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        mileage: 260000,
        vin: '4ALGYGW1H1YP26659',
      }),
    );
  });

  it('returns 404 when another user tries to update vehicle', async () => {
    const owner = await testApp.registerAndGetCookie('owner3@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger3@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());
    const created = createRes.json();

    const patchRes = await updateVehicle(app, stranger.cookie, created.id, {
      vin: 'Hacked',
    });

    expect(patchRes.statusCode).toBe(404);
  });

  it('deletes vehicle', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const deleteRes = await deleteVehicle(app, user.cookie, created.id);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await getVehicle(app, user.cookie, created.id);
    expect(getRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to delete vehicle', async () => {
    const owner = await testApp.registerAndGetCookie('owner4@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger4@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());
    const created = createRes.json();

    const deleteRes = await deleteVehicle(app, stranger.cookie, created.id);

    expect(deleteRes.statusCode).toBe(404);
  });

  it('returns 400 for invalid create body', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await createVehicle(app, user.cookie, new VehicleHttpBuilder().withVin('').build());

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'vin',
            message: expect.stringContaining('>=1 characters'),
          }),
        ]),
      }),
    );
  });

  it('returns 400 for invalid patch body', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createVehicle(app, user.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();
    const res = await updateVehicle(app, user.cookie, created.id, {
      year: 'abc',
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'year',
            message: expect.stringContaining('expected number'),
          }),
        ]),
      }),
    );
  });

  it('returns 401 when user is not authenticated', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/vehicles',
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 404 when vehicle does not exist', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await getVehicle(app, user.cookie, '00000000-0000-0000-0000-000000000000');

    expect(res.statusCode).toBe(404);
  });

  it('does not return vehicles of another user', async () => {
    const owner = await testApp.registerAndGetCookie('owner@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger@test.com');

    await createVehicle(app, owner.cookie, new VehicleHttpBuilder().withModel('340i').build());

    const listRes = await listVehicles(app, stranger.cookie);

    expect(listRes.statusCode).toBe(200);
    const list = listRes.json();

    expect(list.data).toHaveLength(0);
    expect(list.total).toBe(0);
  });

  it('returns 404 when another user tries to fetch vehicle by id', async () => {
    const owner = await testApp.registerAndGetCookie('owner2@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger2@test.com');

    const createRes = await createVehicle(app, owner.cookie, new VehicleHttpBuilder().build());

    const created = createRes.json();

    const getRes = await getVehicle(app, stranger.cookie, created.id);

    expect(getRes.statusCode).toBe(404);
  });
});
