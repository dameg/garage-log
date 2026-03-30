import 'fastify';
import type { AppContainer } from './types';

declare module 'fastify' {
  interface FastifyInstance {
    deps: AppContainer;
  }
}
