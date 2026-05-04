import type { FastifyReply, FastifyRequest } from 'fastify';

import type { RedisService } from '../redis/redis.service';

export function createCacheReadHook(redis: RedisService) {
  return async function cacheReadHook(req: FastifyRequest, reply: FastifyReply) {
    const cacheConfig = req.routeOptions.config.cache;

    if (!cacheConfig) return;
    if (req.method !== 'GET') return;

    const key = cacheConfig.key(req);
    if (!key) return;

    req.cache = { key, hit: false };

    const cachedPayload = await redis.get(key);

    if (!cachedPayload) {
      reply.header('x-cache', 'MISS');
      return;
    }

    req.cache.hit = true;

    return reply.header('x-cache', 'HIT').type('application/json').send(cachedPayload);
  };
}
