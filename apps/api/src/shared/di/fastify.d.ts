import 'fastify';
import type { Deps } from './types';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    deps: Deps;
    redis: Redis;
  }
}
