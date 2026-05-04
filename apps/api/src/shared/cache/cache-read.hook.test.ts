import { describe, expect, it, vi } from 'vitest';

import { createCacheReadHook } from './cache-read.hook';

describe('createCacheReadHook', () => {
  it('skips requests without cache config', async () => {
    const redis = { get: vi.fn() };
    const hook = createCacheReadHook(redis as never);
    const req = {
      method: 'GET',
      routeOptions: { config: {} },
    };
    const reply = { header: vi.fn(), type: vi.fn(), send: vi.fn() };

    await hook(req as never, reply as never);

    expect(redis.get).not.toHaveBeenCalled();
  });

  it('marks cache miss when value is absent', async () => {
    const redis = { get: vi.fn().mockResolvedValue(null) };
    const hook = createCacheReadHook(redis as never);
    const req = {
      method: 'GET',
      routeOptions: {
        config: {
          cache: {
            ttlSeconds: 60,
            key: vi.fn().mockReturnValue('cache:key'),
          },
        },
      },
    };
    const reply = { header: vi.fn().mockReturnThis(), type: vi.fn(), send: vi.fn() };

    await hook(req as never, reply as never);

    expect(req.cache).toEqual({ key: 'cache:key', hit: false });
    expect(reply.header).toHaveBeenCalledWith('x-cache', 'MISS');
    expect(reply.send).not.toHaveBeenCalled();
  });

  it('returns cached payload on hit', async () => {
    const redis = { get: vi.fn().mockResolvedValue('{"ok":true}') };
    const hook = createCacheReadHook(redis as never);
    const req = {
      method: 'GET',
      routeOptions: {
        config: {
          cache: {
            ttlSeconds: 60,
            key: vi.fn().mockReturnValue('cache:key'),
          },
        },
      },
    };
    const reply = {
      header: vi.fn().mockReturnThis(),
      type: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnValue('sent'),
    };

    const result = await hook(req as never, reply as never);

    expect(req.cache).toEqual({ key: 'cache:key', hit: true });
    expect(reply.header).toHaveBeenCalledWith('x-cache', 'HIT');
    expect(reply.type).toHaveBeenCalledWith('application/json');
    expect(reply.send).toHaveBeenCalledWith('{"ok":true}');
    expect(result).toBe('sent');
  });
});
