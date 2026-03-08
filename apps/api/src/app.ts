import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './shared/config';
import { vehiclesModule } from './modules/vehicles/vehicles.module';
import { diPlugin } from './shared/di/di.plugin';
import { createProdDeps } from './shared/di/prod';
import type { Deps } from './shared/di/types';
import { ZodError } from 'zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';

export async function buildApp(deps?: Deps) {
  const app = Fastify({
    logger: env.NODE_ENV === 'test' ? false : { level: env.LOG_LEVEL },
  });

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.code(400).send({
        error: 'Bad Request',
        message: 'Validation error',
        issues: err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }

    req.log.error({ err }, 'Unhandled error');

    return reply.code(500).send({
      error: 'Internal Server Error',
    });
  });

  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
  });

  await app.register(diPlugin, {
    deps: deps ?? createProdDeps(),
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      cb(null, env.FRONTEND_URLS.includes(origin));
    },
    credentials: true,
  });

  app.get('/health', async () => ({ ok: true }));

  await app.register(
    async (api) => {
      await api.register(vehiclesModule);
    },
    { prefix: '/api' },
  );

  return app;
}
