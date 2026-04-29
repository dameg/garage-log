import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { getPrisma } from '../../shared/db/prisma';
import { createDbTestApp } from '../../shared/testing/create-db-test-app';
import { registerAndGetCookie } from '../../shared/testing/register-and-get-cookie';
import { resetDb } from '../../shared/testing/reset-db';
import { createVehicle } from '../vehicles/test/actions/vehicle.actions';
import { VehicleHttpBuilder } from '../vehicles/test/vehicle.http.builder';

import {
  createDocumentLog,
  deleteDocumentLog,
  getDocumentLog,
  listDocumentLogs,
  updateDocumentLog,
} from './test/actions/document-log.actions';
import { DocumentLogHttpBuilder } from './test/document-log.http.builder';

describe('Document logs (db e2e)', () => {
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

  async function createVehicleForUser(cookie: string, model = '330i') {
    const createVehicleRes = await createVehicle(
      app,
      cookie,
      new VehicleHttpBuilder().withModel(model).build(),
    );

    expect(createVehicleRes.statusCode).toBe(201);

    return createVehicleRes.json();
  }

  it('creates and lists document logs only for authenticated owner', async () => {
    const user = await registerAndGetCookie(app, 'user1@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().build(),
    );

    expect(createRes.statusCode).toBe(201);

    const created = createRes.json();
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        vehicleId: vehicle.id,
        ownerId: expect.any(String),
        type: 'insurance',
        title: 'OC policy',
        issuer: 'PZU',
        cost: 1299,
        note: 'Annual renewal',
        createdAt: expect.any(String),
      }),
    );
    expect(created.validFrom).toBe('2025-01-01T00:00:00.000Z');
    expect(created.validTo).toBe('2025-12-31T00:00:00.000Z');
    expect(created.issuedAt).toBe('2024-12-15T00:00:00.000Z');

    const listRes = await listDocumentLogs(app, user.cookie, vehicle.id);

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();
    expect(list.data).toHaveLength(1);
    expect(list.nextCursor).toBe(null);
    expect(list.data[0]).toEqual(
      expect.objectContaining({
        id: created.id,
        vehicleId: vehicle.id,
        ownerId: created.ownerId,
        title: 'OC policy',
      }),
    );
  });

  it('returns document logs as a timeline with cursor pagination', async () => {
    const user = await registerAndGetCookie(app, 'timeline@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    expect(
      (
        await createDocumentLog(
          app,
          user.cookie,
          vehicle.id,
          new DocumentLogHttpBuilder().withTitle('First entry').build(),
        )
      ).statusCode,
    ).toBe(201);
    expect(
      (
        await createDocumentLog(
          app,
          user.cookie,
          vehicle.id,
          new DocumentLogHttpBuilder().withTitle('Second entry').build(),
        )
      ).statusCode,
    ).toBe(201);
    expect(
      (
        await createDocumentLog(
          app,
          user.cookie,
          vehicle.id,
          new DocumentLogHttpBuilder().withTitle('Third entry').build(),
        )
      ).statusCode,
    ).toBe(201);

    const firstPageRes = await listDocumentLogs(app, user.cookie, vehicle.id, { limit: 2 });
    expect(firstPageRes.statusCode).toBe(200);

    const firstPage = firstPageRes.json();
    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.nextCursor).toEqual(
      expect.objectContaining({
        createdAt: expect.any(String),
        id: expect.any(String),
      }),
    );

    const firstPageIds = new Set(firstPage.data.map((item: { id: string }) => item.id));

    const secondPageRes = await listDocumentLogs(app, user.cookie, vehicle.id, {
      limit: 2,
      createdAt: firstPage.nextCursor.createdAt,
      id: firstPage.nextCursor.id,
    });
    expect(secondPageRes.statusCode).toBe(200);

    const secondPage = secondPageRes.json();
    expect(secondPage.data).toHaveLength(1);
    expect(secondPage.nextCursor).toBe(null);
    expect(firstPageIds.has(secondPage.data[0].id)).toBe(false);
  });

  it('returns document log by id for owner', async () => {
    const user = await registerAndGetCookie(app, 'user2@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const getRes = await getDocumentLog(app, user.cookie, vehicle.id, created.id);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        vehicleId: vehicle.id,
        ownerId: created.ownerId,
        title: 'OC policy',
      }),
    );
  });

  it('updates document log for owner', async () => {
    const user = await registerAndGetCookie(app, 'user3@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const patchRes = await updateDocumentLog(app, user.cookie, vehicle.id, created.id, {
      title: '  Extended policy  ',
      issuer: '   ',
      note: '   ',
      cost: 1500,
    });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        vehicleId: vehicle.id,
        ownerId: created.ownerId,
        title: 'Extended policy',
        issuer: null,
        note: null,
        cost: 1500,
      }),
    );
  });

  it('deletes document log for owner', async () => {
    const user = await registerAndGetCookie(app, 'user4@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const deleteRes = await deleteDocumentLog(app, user.cookie, vehicle.id, created.id);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await getDocumentLog(app, user.cookie, vehicle.id, created.id);
    expect(getRes.statusCode).toBe(404);
  });

  it('returns 400 for invalid create body', async () => {
    const user = await registerAndGetCookie(app, 'user5@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const res = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().withTitle('').build(),
    );

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid patch body', async () => {
    const user = await registerAndGetCookie(app, 'user6@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const res = await updateDocumentLog(app, user.cookie, vehicle.id, created.id, {
      cost: 'abc',
    });

    expect(res.statusCode).toBe(400);
  });

  it('returns 401 when request has no auth cookie', async () => {
    const owner = await registerAndGetCookie(app, 'user7@test.com');
    const vehicle = await createVehicleForUser(owner.cookie);

    const res = await app.inject({
      method: 'GET',
      url: `/api/vehicles/${vehicle.id}/document-logs`,
    });

    expect(res.statusCode).toBe(401);
  });

  it('returns 404 when document log does not exist', async () => {
    const user = await registerAndGetCookie(app, 'user8@test.com');
    const vehicle = await createVehicleForUser(user.cookie);

    const res = await getDocumentLog(
      app,
      user.cookie,
      vehicle.id,
      '00000000-0000-0000-0000-000000000000',
    );

    expect(res.statusCode).toBe(404);
  });

  it('returns 404 when document log belongs to another vehicle of the same owner', async () => {
    const user = await registerAndGetCookie(app, 'same-owner@test.com');
    const firstVehicle = await createVehicleForUser(user.cookie, '330i');
    const secondVehicle = await createVehicleForUser(user.cookie, 'M3');

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      firstVehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const getRes = await getDocumentLog(app, user.cookie, secondVehicle.id, created.id);
    expect(getRes.statusCode).toBe(404);

    const patchRes = await updateDocumentLog(app, user.cookie, secondVehicle.id, created.id, {
      title: 'Should not update',
    });
    expect(patchRes.statusCode).toBe(404);

    const deleteRes = await deleteDocumentLog(app, user.cookie, secondVehicle.id, created.id);
    expect(deleteRes.statusCode).toBe(404);

    const stillExistsRes = await getDocumentLog(app, user.cookie, firstVehicle.id, created.id);
    expect(stillExistsRes.statusCode).toBe(200);
  });

  it('does not show document logs of another user', async () => {
    const owner = await registerAndGetCookie(app, 'owner@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger@test.com');
    const ownerVehicle = await createVehicleForUser(owner.cookie, '340i');
    const strangerVehicle = await createVehicleForUser(stranger.cookie, 'A4');

    await createDocumentLog(
      app,
      owner.cookie,
      ownerVehicle.id,
      new DocumentLogHttpBuilder().build(),
    );

    const listRes = await listDocumentLogs(app, stranger.cookie, strangerVehicle.id);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().data).toHaveLength(0);
    expect(listRes.json().nextCursor).toBe(null);
  });

  it('returns 404 when another user tries to fetch document log by id', async () => {
    const owner = await registerAndGetCookie(app, 'owner2@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger2@test.com');
    const ownerVehicle = await createVehicleForUser(owner.cookie);

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      ownerVehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const getRes = await getDocumentLog(app, stranger.cookie, ownerVehicle.id, created.id);

    expect(getRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to update document log', async () => {
    const owner = await registerAndGetCookie(app, 'owner3@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger3@test.com');
    const ownerVehicle = await createVehicleForUser(owner.cookie);

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      ownerVehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const patchRes = await updateDocumentLog(app, stranger.cookie, ownerVehicle.id, created.id, {
      title: 'Hacked title',
    });

    expect(patchRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to delete document log', async () => {
    const owner = await registerAndGetCookie(app, 'owner4@test.com');
    const stranger = await registerAndGetCookie(app, 'stranger4@test.com');
    const ownerVehicle = await createVehicleForUser(owner.cookie);

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      ownerVehicle.id,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const deleteRes = await deleteDocumentLog(app, stranger.cookie, ownerVehicle.id, created.id);

    expect(deleteRes.statusCode).toBe(404);
  });
});
