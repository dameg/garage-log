import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../testing/create-test-app';

describe('OpenAPI documentation', () => {
  let app: Awaited<ReturnType<typeof createTestApp>> | null = null;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = null;
    }
  });

  it('documents rate-limited routes with 429 responses and Retry-After headers', async () => {
    app = await createTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/openapi.json',
    });

    expect(res.statusCode).toBe(200);

    const document = res.json();

    expect(document.info.description).toContain('Retry-After');

    expect(document.paths['/api/auth/login'].post.responses['429']).toEqual(
      expect.objectContaining({
        description: 'Too many login attempts',
        headers: {
          'Retry-After': expect.objectContaining({
            description: expect.stringContaining('Seconds until the client can retry'),
            schema: expect.objectContaining({
              type: 'string',
              example: '600',
            }),
          }),
        },
      }),
    );

    expect(document.paths['/api/vehicles/'].get.responses['429']).toEqual(
      expect.objectContaining({
        description: 'Rate limit exceeded',
        headers: {
          'Retry-After': expect.objectContaining({
            schema: expect.objectContaining({
              type: 'string',
              example: '1',
            }),
          }),
        },
      }),
    );
  });
});
