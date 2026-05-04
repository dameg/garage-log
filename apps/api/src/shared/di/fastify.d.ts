import type { RouteCacheConfig } from '../cache/cache.types';

import type { AppContainer } from './types';

import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    deps: AppContainer;
  }
  interface FastifyRequest {
    cache?: {
      key: string;
      hit: boolean;
    };
  }

  interface FastifyContextConfig {
    cache?: RouteCacheConfig;
  }
}
