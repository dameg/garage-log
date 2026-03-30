import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { AppContainer } from './types';

export const diPlugin = fp(async (app: FastifyInstance, opts: { deps: AppContainer }) => {
  app.decorate('deps', opts.deps);
});
