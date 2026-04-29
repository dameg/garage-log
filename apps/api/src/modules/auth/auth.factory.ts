import type { FastifyInstance } from 'fastify';

import { LoginUserUseCase } from './application/login.usecase';
import { RegisterUserUseCase } from './application/register.usecase';

export function createAuthServices(app: FastifyInstance) {
  return {
    loginUserUseCase: new LoginUserUseCase(app.deps.usersRepo),
    registerUserUseCase: new RegisterUserUseCase(app.deps.usersRepo),
  };
}
