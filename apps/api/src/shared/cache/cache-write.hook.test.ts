import { describe, expect, it, vi } from 'vitest';

import { createCacheWriteHook } from './cache-write.hook';

describe('createCacheWriteHook', () => {
  it('writes uncached 200 GET response to redis with ttl', async () => {
    const redis = { set: vi.fn().mockResolvedValue(undefined) };
    const hook = createCacheWriteHook(redis as never);
    const req = {
      method: 'GET',
      cache: { key: 'cache:key', hit: false },
      routeOptions: {
        config: {
          cache: {
            ttlSeconds: 60,
            key: vi.fn(),
          },
        },
      },
    };
    const reply = { statusCode: 200, header: vi.fn() };
    const payload = { data: ['a'] };

    const result = await hook(req as never, reply as never, payload);

    expect(redis.set).toHaveBeenCalledWith('cache:key', JSON.stringify(payload), 60);
    expect(reply.header).toHaveBeenCalledWith('x-cache', 'MISS');
    expect(result).toBe(payload);
  });

  it('skips writes for cache hits', async () => {
    const redis = { set: vi.fn().mockResolvedValue(undefined) };
    const hook = createCacheWriteHook(redis as never);
    const req = {
      method: 'GET',
      cache: { key: 'cache:key', hit: true },
      routeOptions: {
        config: {
          cache: {
            ttlSeconds: 60,
            key: vi.fn(),
          },
        },
      },
    };
    const reply = { statusCode: 200, header: vi.fn() };

    await hook(req as never, reply as never, { ok: true });

    expect(redis.set).not.toHaveBeenCalled();
    expect(reply.header).not.toHaveBeenCalled();
  });

  it('skips writes for non-200 responses', async () => {
    const redis = { set: vi.fn().mockResolvedValue(undefined) };
    const hook = createCacheWriteHook(redis as never);
    const req = {
      method: 'GET',
      cache: { key: 'cache:key', hit: false },
      routeOptions: {
        config: {
          cache: {
            ttlSeconds: 60,
            key: vi.fn(),
          },
        },
      },
    };
    const reply = { statusCode: 404, header: vi.fn() };

    await hook(req as never, reply as never, { error: 'Not Found' });

    expect(redis.set).not.toHaveBeenCalled();
    expect(reply.header).not.toHaveBeenCalled();
  });

  it('skips writes for requests without cache config', async () => {
    const redis = { set: vi.fn().mockResolvedValue(undefined) };
    const hook = createCacheWriteHook(redis as never);
    const req = {
      method: 'GET',
      cache: { key: 'cache:key', hit: false },
      routeOptions: { config: {} },
    };
    const reply = { statusCode: 200, header: vi.fn() };

    await hook(req as never, reply as never, { ok: true });

    expect(redis.set).not.toHaveBeenCalled();
  });
});
