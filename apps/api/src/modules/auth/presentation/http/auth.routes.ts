import type { FastifyInstance } from 'fastify';

import { requireAuth } from '../../../../shared/auth/require-auth';
import { createAuthServices } from '../../auth.factory';
import { registerUserHttpSchema } from '../validation/register-user.schema';
import { loginUserHttpSchema } from '../validation/login-user.schema';
import { clearAuthCookie, setAuthCookie } from '../../../../shared/auth/auth-cookies';

export async function authRoutes(app: FastifyInstance) {
  const { registerUserUseCase, loginUserUseCase } = createAuthServices(app);

  app.post('/register', async (req, reply) => {
    const parsed = registerUserHttpSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid request body',
        issues: parsed.error.issues,
      });
    }

    const user = await registerUserUseCase.execute(parsed.data);

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

  app.post('/login', async (req, reply) => {
    console.log('LOGIN BODY', req.body);
    const parsed = loginUserHttpSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Invalid request body',
        issues: parsed.error.issues,
      });
    }

    const user = await loginUserUseCase.execute(parsed.data);

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
      return reply.code(401).send({
        message: 'Unauthorized',
      });
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
