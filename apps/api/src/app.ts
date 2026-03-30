import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './shared/config';
import { vehiclesModule } from './modules/vehicles/vehicles.module';
import { diPlugin } from './shared/di/di.plugin';
import { createProdDeps } from './shared/di/prod';
import type { AppContainer } from './shared/di/types';
import { ZodError } from 'zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { NotFoundError } from './shared/errors/not-found-error';
import { ConflictError } from './shared/errors/conflict-error';
import { authModule } from './modules/auth/auth.module';
import { UnauthorizedError } from './shared/errors/unauthorized-error';
import { closePrisma } from './shared/db/prisma';
import { RateLimitExceededError } from './shared/errors/rate-limit-error';
import { DomainError } from './shared/errors/domain-error';

export async function buildApp(deps?: AppContainer) {
  const app = Fastify({
    logger:
      env.NODE_ENV === 'test'
        ? false
        : {
            level: env.LOG_LEVEL,
            transport: {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                colorize: true,
                singleLine: false,
              },
            },
          },
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

    if (err instanceof DomainError) {
      return reply.code(400).send({
        error: 'Bad Request',
        message: err.message,
        issues: [],
      });
    }

    if (err instanceof NotFoundError) {
      return reply.code(404).send({
        error: 'Not Found',
        message: err.message,
      });
    }

    if (err instanceof ConflictError) {
      return reply.code(409).send({
        error: 'Conflict',
        message: err.message,
      });
    }

    if (err instanceof UnauthorizedError) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: err.message,
      });
    }

    if (err instanceof RateLimitExceededError) {
      return reply.code(429).header('Retry-After', err.retryAfterSec.toString()).send({
        error: 'Too Many Requests',
        message: err.message,
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
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.get('/health', async () => {
    const redis = await app.deps.redisService.ping();

    return {
      ok: true,
      redis,
    };
  });

  app.addHook('onClose', async () => {
    await app.deps.redisService.quit();
    await closePrisma();
  });

  await app.register(
    async (api) => {
      await api.register(authModule);
      await api.register(vehiclesModule);
    },
    { prefix: '/api' },
  );

  return app;
}
