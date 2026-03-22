import type { FastifyInstance } from 'fastify';

import { requireAuth } from '../../../../shared/auth/require-auth';
import { createAuthServices } from '../../auth.factory';
import { registerUserHttpSchema } from '../validation/register-user.schema';
import { loginUserHttpSchema } from '../validation/login-user.schema';
import { clearAuthCookie, setAuthCookie } from '../../../../shared/auth/auth-cookies';
import { UnauthorizedError } from '../../../../shared/errors/unauthorized-error';
import {
  authResponseSchema,
  conflictErrorResponseSchema,
  createRateLimitOpenApiResponse,
  internalServerErrorResponseSchema,
  loginRateLimitDescription,
  toOpenApiSchema,
  unauthorizedErrorResponseSchema,
  validationErrorResponseSchema,
} from '../../../../shared/http/openapi';
import { createRateLimitServices } from '../../../../shared/rate-limit/rate-limit.factory';

export async function authRoutes(app: FastifyInstance) {
  const { registerUserUseCase, loginUserUseCase } = createAuthServices(app);

  const { loginRateLimitGuard } = createRateLimitServices(app);

  app.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'registerUser',
        summary: 'Register a user',
        description:
          'Creates a new user account and immediately sets the `access_token` auth cookie used by protected endpoints.',
        body: toOpenApiSchema(registerUserHttpSchema),
        response: {
          201: {
            description: 'User registered successfully',
            ...authResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          409: {
            description: 'User already exists',
            ...conflictErrorResponseSchema,
          },
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const body = registerUserHttpSchema.parse(req.body);

      const user = await registerUserUseCase.execute(body);

      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
      });

      setAuthCookie(reply, token);

      return reply.code(201).send({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    },
  );

  app.post(
    '/login',
    {
      preHandler: [loginRateLimitGuard],
      schema: {
        tags: ['Auth'],
        operationId: 'loginUser',
        summary: 'Log in',
        description:
          'Authenticates a user and sets the `access_token` auth cookie used by protected endpoints. ' +
          loginRateLimitDescription,
        body: toOpenApiSchema(loginUserHttpSchema),
        response: {
          200: {
            description: 'User logged in successfully',
            ...authResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Invalid credentials',
            ...unauthorizedErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse('Too many login attempts'),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const body = loginUserHttpSchema.parse(req.body);

      const user = await loginUserUseCase.execute(body);

      const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
      });

      setAuthCookie(reply, token);

      return reply.code(200).send({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    },
  );

  app.get(
    '/me',
    {
      preHandler: requireAuth,
      schema: {
        tags: ['Auth'],
        operationId: 'getCurrentUser',
        summary: 'Get current user',
        description:
          'Returns the currently authenticated user. This endpoint requires the `access_token` cookie returned by `/api/auth/register` or `/api/auth/login`.',
        security: [{ cookieAuth: [] }],
        response: {
          200: {
            description: 'Authenticated user',
            ...authResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const user = await app.deps.usersRepo.findById(req.user.sub);

      if (!user) {
        throw new UnauthorizedError();
      }

      return reply.code(200).send({
        user: {
          id: user.id,
          email: user.email,
        },
      });
    },
  );

  app.post(
    '/logout',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'logoutUser',
        summary: 'Log out',
        description: 'Clears the `access_token` auth cookie for the current session.',
        response: {
          204: {
            description: 'Logged out successfully',
          },
        },
      },
    },
    async (_req, reply) => {
      clearAuthCookie(reply);

      return reply.code(204).send();
    },
  );
}
