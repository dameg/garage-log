import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { AppContainer } from '../../shared/di/types';
import { createTestApp } from '../../shared/testing/create-test-app';

import {
  createDocumentLog,
  deleteDocumentLog,
  getDocumentLog,
  listDocumentLogs,
  updateDocumentLog,
} from './test/actions/document.actions';
import { DocumentLogHttpBuilder } from './test/document-log.http.builder';
import { SpyDocumentLogRepository } from './test/in-memory/spy-document-log.repository';

describe('Document logs (integration - in memory)', () => {
  const vehicleId = 'vehicle-1';
  let testApp: Awaited<ReturnType<typeof createTestApp>>;
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];

  beforeEach(async () => {
    testApp = await createTestApp();
    app = testApp.app;
  });

  afterEach(async () => {
    await testApp.close();
  });

  it('creates and lists document logs for authenticated owner', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );

    expect(createRes.statusCode).toBe(201);

    const created = createRes.json();
    const listRes = await listDocumentLogs(app, user.cookie, vehicleId);

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();

    expect(list.data).toHaveLength(1);
    expect(list.nextCursor).toBe(null);
    expect(list.data[0]).toEqual(
      expect.objectContaining({
        id: created.id,
        vehicleId,
        ownerId: created.ownerId,
        title: 'OC policy',
      }),
    );
  });

  it('returns document logs as a timeline with cursor pagination', async () => {
    const user = await testApp.registerAndGetCookie();

    const firstCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().withTitle('First entry').build(),
    );
    expect(firstCreateRes.statusCode).toBe(201);

    const secondCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().withTitle('Second entry').build(),
    );
    expect(secondCreateRes.statusCode).toBe(201);

    const thirdCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().withTitle('Third entry').build(),
    );
    expect(thirdCreateRes.statusCode).toBe(201);

    const firstPageRes = await listDocumentLogs(app, user.cookie, vehicleId, { limit: 2 });

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

    const secondPageRes = await listDocumentLogs(app, user.cookie, vehicleId, {
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

  it('creates, updates, fetches, and deletes a document log for the authenticated owner', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );

    expect(createRes.statusCode).toBe(201);

    const created = createRes.json();

    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        vehicleId,
        ownerId: expect.any(String),
        type: 'insurance',
        title: 'OC policy',
        issuer: 'PZU',
        cost: 1299,
        note: 'Annual renewal',
      }),
    );
    expect(created.validFrom).toBe('2025-01-01T00:00:00.000Z');
    expect(created.validTo).toBe('2025-12-31T00:00:00.000Z');
    expect(created.issuedAt).toBe('2024-12-15T00:00:00.000Z');

    const patchRes = await updateDocumentLog(app, user.cookie, vehicleId, created.id, {
      title: '  Extended policy  ',
      issuer: '   ',
      note: '   ',
      cost: 1500,
    });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Extended policy',
        issuer: null,
        note: null,
        cost: 1500,
      }),
    );

    const getRes = await getDocumentLog(app, user.cookie, vehicleId, created.id);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.json()).toEqual(
      expect.objectContaining({
        id: created.id,
        title: 'Extended policy',
        issuer: null,
        note: null,
        cost: 1500,
      }),
    );

    const deleteRes = await deleteDocumentLog(app, user.cookie, vehicleId, created.id);

    expect(deleteRes.statusCode).toBe(204);

    const afterDeleteRes = await getDocumentLog(app, user.cookie, vehicleId, created.id);

    expect(afterDeleteRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to update a document log', async () => {
    const owner = await testApp.registerAndGetCookie('owner-update@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger-update@test.com');

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const patchRes = await updateDocumentLog(app, stranger.cookie, vehicleId, created.id, {
      title: 'Hacked title',
    });

    expect(patchRes.statusCode).toBe(404);
  });

  it('returns 404 when another user tries to delete a document log', async () => {
    const owner = await testApp.registerAndGetCookie('owner-delete@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger-delete@test.com');

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const deleteRes = await deleteDocumentLog(app, stranger.cookie, vehicleId, created.id);

    expect(deleteRes.statusCode).toBe(404);
  });

  it('maps list query params into the repository query and injects the authenticated owner', async () => {
    const repo = new SpyDocumentLogRepository();

    await testApp.close();
    testApp = await createTestApp({ documentLogsRepo: repo } satisfies Partial<AppContainer>);
    app = testApp.app;

    const user = await testApp.registerAndGetCookie();

    const listRes = await listDocumentLogs(app, user.cookie, vehicleId, {
      createdAt: '2025-01-01T00:00:00.000Z',
      id: 'cursor-id',
      limit: 5,
    });

    expect(listRes.statusCode).toBe(200);
    expect(repo.lastListQuery).toEqual({
      ownerId: expect.any(String),
      vehicleId,
      cursor: {
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        id: 'cursor-id',
      },
      limit: 5,
    });
  });

  it('returns 400 for invalid create body', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().withTitle('').build(),
    );

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'title',
            message: expect.stringContaining('>=1 characters'),
          }),
        ]),
      }),
    );
  });

  it('returns 400 for invalid patch body', async () => {
    const user = await testApp.registerAndGetCookie();

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const res = await updateDocumentLog(app, user.cookie, vehicleId, created.id, {
      cost: 'abc',
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'cost',
            message: expect.stringContaining('expected number'),
          }),
        ]),
      }),
    );
  });

  it('returns 400 for invalid cursor', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await listDocumentLogs(app, user.cookie, vehicleId, {
      id: 'cursor-id',
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'createdAt',
            message: 'createdAt and id must be provided together',
          }),
        ]),
      }),
    );
  });

  it('returns 404 when another user tries to fetch a document log', async () => {
    const owner = await testApp.registerAndGetCookie('owner@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger@test.com');

    const createRes = await createDocumentLog(
      app,
      owner.cookie,
      vehicleId,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const getRes = await getDocumentLog(app, stranger.cookie, vehicleId, created.id);

    expect(getRes.statusCode).toBe(404);
  });

  it('returns 404 when document log does not exist', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await getDocumentLog(
      app,
      user.cookie,
      vehicleId,
      '00000000-0000-0000-0000-000000000000',
    );

    expect(res.statusCode).toBe(404);
  });

  it('returns 404 when document log belongs to another vehicle of the same owner', async () => {
    const user = await testApp.registerAndGetCookie();
    const correctVehicleId = 'vehicle-correct';
    const wrongVehicleId = 'vehicle-wrong';

    const createRes = await createDocumentLog(
      app,
      user.cookie,
      correctVehicleId,
      new DocumentLogHttpBuilder().build(),
    );
    const created = createRes.json();

    const getRes = await getDocumentLog(app, user.cookie, wrongVehicleId, created.id);
    expect(getRes.statusCode).toBe(404);

    const patchRes = await updateDocumentLog(app, user.cookie, wrongVehicleId, created.id, {
      title: 'Should not update',
    });
    expect(patchRes.statusCode).toBe(404);

    const deleteRes = await deleteDocumentLog(app, user.cookie, wrongVehicleId, created.id);
    expect(deleteRes.statusCode).toBe(404);

    const stillExistsRes = await getDocumentLog(app, user.cookie, correctVehicleId, created.id);
    expect(stillExistsRes.statusCode).toBe(200);
  });

  it('does not list document logs of another user', async () => {
    const owner = await testApp.registerAndGetCookie('owner-list@test.com');
    const stranger = await testApp.registerAndGetCookie('stranger-list@test.com');

    await createDocumentLog(app, owner.cookie, vehicleId, new DocumentLogHttpBuilder().build());

    const listRes = await listDocumentLogs(app, stranger.cookie, vehicleId);

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();

    expect(list.data).toHaveLength(0);
    expect(list.nextCursor).toBe(null);
  });

  it('returns 401 when user is not authenticated', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/vehicles/${vehicleId}/document-logs`,
    });

    expect(res.statusCode).toBe(401);
  });
});
