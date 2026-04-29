import type { FastifyInstance } from 'fastify';

import { clearAuthCookie, setAuthCookie } from '../../../../shared/auth/auth-cookies';
import { requireAuth } from '../../../../shared/auth/require-auth';
import { UnauthorizedError } from '../../../../shared/errors/unauthorized-error';
import { createRateLimitServices } from '../../../../shared/rate-limit/rate-limit.factory';
import { createAuthServices } from '../../auth.factory';
import { loginUserHttpSchema } from '../validation/login-user.schema';
import { registerUserHttpSchema } from '../validation/register-user.schema';

export async function authRoutes(app: FastifyInstance) {
  const { registerUserUseCase, loginUserUseCase } = createAuthServices(app);

  const { loginRateLimitGuard } = createRateLimitServices(app);

  app.post('/register', async (req, reply) => {
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
  });

  app.post('/login', { preHandler: [loginRateLimitGuard] }, async (req, reply) => {
    const body = loginUserHttpSchema.parse(req.body);
    console.log(body);
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
  });

  app.get('/me', { preHandler: requireAuth }, async (req, reply) => {
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
  });

  app.post('/logout', async (_req, reply) => {
    clearAuthCookie(reply);

    return reply.code(204).send();
  });
}
