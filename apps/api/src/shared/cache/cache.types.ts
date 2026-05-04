import type { FastifyRequest } from 'fastify';

export type CacheKeyFactory = (req: FastifyRequest) => string | null;

export type RouteCacheConfig = {
  ttlSeconds: number;
  key: CacheKeyFactory;
};
