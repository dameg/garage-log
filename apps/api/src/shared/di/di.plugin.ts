import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { Deps } from './types';

export const diPlugin = fp(async (app: FastifyInstance, opts: { deps: Deps }) => {
  app.decorate('deps', opts.deps);
});
