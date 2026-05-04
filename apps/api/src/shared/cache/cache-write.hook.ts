import type { FastifyReply, FastifyRequest } from 'fastify';

import type { RedisService } from '../redis/redis.service';

export function createCacheWriteHook(redis: RedisService) {
  return async function cacheWriteHook(req: FastifyRequest, reply: FastifyReply, payload: unknown) {
    const cacheConfig = req.routeOptions.config.cache;

    if (!cacheConfig) return payload;
    if (req.method !== 'GET') return payload;
    if (!req.cache?.key) return payload;
    if (req.cache.hit) return payload;
    if (reply.statusCode !== 200) return payload;

    const serializedPayload =
      typeof payload === 'string' || Buffer.isBuffer(payload)
        ? payload.toString()
        : JSON.stringify(payload);

    await redis.set(req.cache.key, serializedPayload, cacheConfig.ttlSeconds);

    reply.header('x-cache', 'MISS');

    return payload;
  };
}
