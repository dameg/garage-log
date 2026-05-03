import { afterEach, describe, expect, it } from 'vitest';

import { createTestApp } from '../testing/create-test-app';

import { SpyCheckSlidingWindowUseCase } from './test/spy-check-sliding-window.usecase';
import { SpyConsumeTokenBucketUseCase } from './test/spy-consume-token-bucket.usecase';

import { listVehicles } from '@/modules/vehicle/test/actions/vehicle.actions';

describe('Rate limit (integration)', () => {
  let testApp: Awaited<ReturnType<typeof createTestApp>>;
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];

  afterEach(async () => {
    if (testApp) {
      await testApp.close();
    }
  });

  it('returns 429 and Retry-After for authenticated vehicles requests when token bucket denies', async () => {
    testApp = await createTestApp({
      consumeTokenBucketUseCase: new SpyConsumeTokenBucketUseCase({
        allowed: false,
        remaining: 0,
        retryAfterSec: 7,
      }),
    });
    app = testApp.app;
    const user = await testApp.registerAndGetCookie('rate-limit-vehicles@test.com');

    const res = await listVehicles(app, user.cookie);

    expect(res.statusCode).toBe(429);
    expect(res.headers['retry-after']).toBe('7');
    expect(res.json()).toEqual({
      error: 'Too Many Requests',
      message: 'Too many requests',
    });
  });

  it('returns 429 and Retry-After for login when sliding window denies', async () => {
    testApp = await createTestApp({
      checkSlidingWindowUseCase: new SpyCheckSlidingWindowUseCase({
        allowed: false,
        count: 5,
        retryAfterSec: 11,
      }),
    });
    app = testApp.app;

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'rate-limit-login@test.com',
        password: 'wrong-password',
      },
    });

    expect(res.statusCode).toBe(429);
    expect(res.headers['retry-after']).toBe('11');
    expect(res.json()).toEqual({
      error: 'Too Many Requests',
      message: 'Too many requests',
    });
  });

  it('lets requests through when token bucket allows them', async () => {
    testApp = await createTestApp({
      consumeTokenBucketUseCase: new SpyConsumeTokenBucketUseCase({
        allowed: true,
        remaining: 10,
        retryAfterSec: 0,
      }),
    });
    app = testApp.app;
    const user = await testApp.registerAndGetCookie('rate-limit-allow@test.com');

    const res = await listVehicles(app, user.cookie);

    expect(res.statusCode).toBe(200);
  });
});
