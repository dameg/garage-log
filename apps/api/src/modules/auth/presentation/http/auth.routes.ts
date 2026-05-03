import type { FastifyInstance } from 'fastify';

import { clearAuthCookie, setAuthCookie } from '../../../../shared/auth/auth-cookies';
import { parseBody } from '../../../../shared/http/validation';
import { loginHttpSchema } from '../validation/login.schema';
import { registerHttpSchema } from '../validation/register.schema';

import type { AuthRoutesOptions } from './auth.routes.types';

export async function authRoutes(app: FastifyInstance, { services, guards }: AuthRoutesOptions) {
  const { loginUseCase, registerUseCase, getCurrentUserUseCase } = services;
  const { requireAuth, loginRateLimit } = guards;
  app.post('/register', async (req, reply) => {
    const body = parseBody(registerHttpSchema, req.body);

    const user = await registerUseCase.execute(body);

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
  });

  app.post(
    '/login',
    {
      preHandler: [loginRateLimit],
      config: {
        rateLimit: {
          type: 'auth',
        },
      },
    },
    async (req, reply) => {
      const body = parseBody(loginHttpSchema, req.body);

      const user = await loginUseCase.execute(body);

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

  app.get('/me', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = await getCurrentUserUseCase.execute({ userId: req.user.sub });

    return reply.code(200).send({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  });

  app.post('/logout', async (_req, reply) => {
    clearAuthCookie(reply);

    return reply.code(204).send();
  });
}
