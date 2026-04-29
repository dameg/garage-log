import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { AppContainer } from '../../shared/di/types';
import { createTestApp } from '../../shared/testing/create-test-app';
import { DocumentLogHttpBuilder } from './test/document-log.http.builder';
import { SpyDocumentLogRepository } from './test/in-memory/spy-document-log.repository';
import {
  createDocumentLog,
  deleteDocumentLog,
  getDocumentLog,
  listDocumentLogs,
  updateDocumentLog,
} from './test/actions/document-log.actions';

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
    expect(list.total).toBe(1);
    expect(list.page).toBe(1);
    expect(list.limit).toBe(10);
    expect(list.data[0]).toEqual(
      expect.objectContaining({
        id: created.id,
        vehicleId,
        ownerId: created.ownerId,
        title: 'OC policy',
      }),
    );
  });

  it('filters document logs from the list query', async () => {
    const user = await testApp.registerAndGetCookie();

    const matchingCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withTitle('OC policy 2025')
        .withIssuer('PZU')
        .withValidFrom('2025-01-01T00:00:00.000Z')
        .withValidTo('2025-12-31T00:00:00.000Z')
        .withIssuedAt('2024-12-15T00:00:00.000Z')
        .withCost(1299)
        .build(),
    );
    expect(matchingCreateRes.statusCode).toBe(201);

    const missingCostCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withType('inspection')
        .withTitle('Technical inspection')
        .withIssuer('District Station')
        .withValidFrom('2025-02-01T00:00:00.000Z')
        .withValidTo('2025-02-28T00:00:00.000Z')
        .withIssuedAt(undefined)
        .withCost(undefined)
        .withNote(undefined)
        .build(),
    );
    expect(missingCostCreateRes.statusCode).toBe(201);

    const differentInsuranceCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withTitle('Fleet insurance package')
        .withIssuer('Warta')
        .withValidFrom('2025-03-01T00:00:00.000Z')
        .withValidTo('2026-02-28T00:00:00.000Z')
        .withIssuedAt('2025-01-15T00:00:00.000Z')
        .withCost(5000)
        .build(),
    );
    expect(differentInsuranceCreateRes.statusCode).toBe(201);

    const listRes = await listDocumentLogs(app, user.cookie, vehicleId, {
      search: 'policy',
      type: 'insurance',
      issuer: 'PZU',
      costFrom: 1000,
      costTo: 1500,
      hasCost: true,
      issuedAtFrom: '2024-12-01T00:00:00.000Z',
      issuedAtTo: '2024-12-31T00:00:00.000Z',
      validFromFrom: '2025-01-01T00:00:00.000Z',
      validFromTo: '2025-01-31T00:00:00.000Z',
      validToFrom: '2025-12-01T00:00:00.000Z',
      validToTo: '2025-12-31T00:00:00.000Z',
      sortBy: 'validTo',
      direction: 'asc',
    });

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();

    expect(list.total).toBe(1);
    expect(list.data).toHaveLength(1);
    expect(list.data[0]).toEqual(
      expect.objectContaining({
        title: 'OC policy 2025',
        type: 'insurance',
        issuer: 'PZU',
        cost: 1299,
      }),
    );
  });

  it('sorts and paginates document logs from the list query', async () => {
    const user = await testApp.registerAndGetCookie();

    const decemberCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withTitle('December renewal')
        .withValidTo('2025-12-31T00:00:00.000Z')
        .build(),
    );
    expect(decemberCreateRes.statusCode).toBe(201);

    const marchCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withTitle('March renewal')
        .withValidTo('2025-03-31T00:00:00.000Z')
        .build(),
    );
    expect(marchCreateRes.statusCode).toBe(201);

    const juneCreateRes = await createDocumentLog(
      app,
      user.cookie,
      vehicleId,
      new DocumentLogHttpBuilder()
        .withTitle('June renewal')
        .withValidTo('2025-06-30T00:00:00.000Z')
        .build(),
    );
    expect(juneCreateRes.statusCode).toBe(201);

    const listRes = await listDocumentLogs(app, user.cookie, vehicleId, {
      sortBy: 'validTo',
      direction: 'asc',
      page: 2,
      limit: 1,
    });

    expect(listRes.statusCode).toBe(200);

    const list = listRes.json();

    expect(list.total).toBe(3);
    expect(list.page).toBe(2);
    expect(list.limit).toBe(1);
    expect(list.data).toHaveLength(1);
    expect(list.data[0]).toEqual(
      expect.objectContaining({
        title: 'June renewal',
        validTo: '2025-06-30T00:00:00.000Z',
      }),
    );
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
      search: 'policy',
      type: 'insurance',
      issuer: 'PZU',
      costFrom: 100,
      costTo: 2000,
      hasCost: true,
      issuedAtFrom: '2024-01-01T00:00:00.000Z',
      issuedAtTo: '2024-12-31T00:00:00.000Z',
      validFromFrom: '2025-01-01T00:00:00.000Z',
      validFromTo: '2025-06-30T00:00:00.000Z',
      validToFrom: '2025-07-01T00:00:00.000Z',
      validToTo: '2025-12-31T00:00:00.000Z',
      sortBy: 'validTo',
      direction: 'asc',
      page: 2,
      limit: 5,
    });

    expect(listRes.statusCode).toBe(200);
    expect(repo.lastListQuery).toEqual({
      ownerId: expect.any(String),
      vehicleId,
      filters: {
        search: 'policy',
        type: 'insurance',
        issuer: 'PZU',
        costFrom: 100,
        costTo: 2000,
        hasCost: true,
        issuedAtFrom: new Date('2024-01-01T00:00:00.000Z'),
        issuedAtTo: new Date('2024-12-31T00:00:00.000Z'),
        validFromFrom: new Date('2025-01-01T00:00:00.000Z'),
        validFromTo: new Date('2025-06-30T00:00:00.000Z'),
        validToFrom: new Date('2025-07-01T00:00:00.000Z'),
        validToTo: new Date('2025-12-31T00:00:00.000Z'),
      },
      sort: {
        field: 'validTo',
        direction: 'asc',
      },
      page: 2,
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

  it('returns 400 for invalid list query ranges', async () => {
    const user = await testApp.registerAndGetCookie();

    const res = await listDocumentLogs(app, user.cookie, vehicleId, {
      costFrom: 2000,
      costTo: 100,
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: 'Validation error',
        issues: expect.arrayContaining([
          expect.objectContaining({
            path: 'costFrom',
            message: 'costFrom must be <= costTo',
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
    expect(list.total).toBe(0);
  });

  it('returns 401 when user is not authenticated', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/vehicles/${vehicleId}/document-logs`,
    });

    expect(res.statusCode).toBe(401);
  });
});
