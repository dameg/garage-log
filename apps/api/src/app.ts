import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import { env } from './shared/config';
import { vehiclesModule } from './modules/vehicles/vehicles.module';
import { diPlugin } from './shared/di/di.plugin';
import { createProdDeps } from './shared/di/prod';
import type { Deps } from './shared/di/types';
import { ZodError } from 'zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { NotFoundError } from './shared/errors/not-found-error';
import { ConflictError } from './shared/errors/conflict-error';
import { authModule } from './modules/auth/auth.module';
import { UnauthorizedError } from './shared/errors/unauthorized-error';
import { closePrisma } from './shared/db/prisma';
import scalar from '@scalar/fastify-api-reference';
import { enhanceOpenApiDocument, healthResponseSchema } from './shared/http/openapi';

export async function buildApp(deps?: Deps) {
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

  await app.register(swagger, {
    hideUntagged: true,
    transformObject: (documentObject) =>
      'openapiObject' in documentObject
        ? enhanceOpenApiDocument(documentObject.openapiObject ?? {})
        : (documentObject.swaggerObject ?? {}),
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'GarageLog API',
        description: [
          'API documentation for the GarageLog backend.',
          '',
          'Authentication uses an `access_token` cookie.',
          '1. Call `POST /api/auth/register` or `POST /api/auth/login`.',
          '2. Reuse the returned cookie for protected `/api/vehicles/*` endpoints.',
          '3. Call `POST /api/auth/logout` to clear the session.',
        ].join('\n'),
        version: '1.0.0',
      },
      servers: [
        {
          url: '/',
          description: 'Current server origin',
        },
      ],
      tags: [
        { name: 'System', description: 'System and operational endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Vehicles', description: 'Vehicle management endpoints' },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'access_token',
            description: 'JWT auth cookie returned by the login and register endpoints.',
          },
        },
      },
    },
  });

  app.get('/health', {
    schema: {
      tags: ['System'],
      summary: 'Health check',
      description: 'Checks whether the API and Redis are reachable.',
      response: {
        200: {
          description: 'Service is healthy',
          ...healthResponseSchema,
        },
      },
    },
  }, async () => {
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

  app.get('/openapi.json', {
    schema: {
      hide: true,
    },
  }, async () => app.swagger());

  await app.register(scalar, {
    routePrefix: '/docs',
    configuration: {
      title: 'GarageLog API Reference',
      url: '/openapi.json',
      theme: 'kepler',
    },
  });

  return app;
}
