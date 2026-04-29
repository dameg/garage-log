import type { AppContainer } from './types';

import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    deps: AppContainer;
  }
}
