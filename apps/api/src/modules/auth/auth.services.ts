import { GetCurrentUserUseCase } from './application/get-current-user.usecase';
import { LoginUserUseCase } from './application/login.usecase';
import { RegisterUserUseCase } from './application/register.usecase';
import type { UserRepository } from './contracts/user.repository';

type AuthDeps = {
  repository: UserRepository;
};

export function createAuthServices({ repository }: AuthDeps) {
  return {
    loginUseCase: new LoginUserUseCase(repository),
    registerUseCase: new RegisterUserUseCase(repository),
    getCurrentUserUseCase: new GetCurrentUserUseCase(repository),
  };
}
