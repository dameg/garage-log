import 'fastify';
import type { Deps } from './types';

declare module 'fastify' {
  interface FastifyInstance {
    deps: Deps;
  }
}
