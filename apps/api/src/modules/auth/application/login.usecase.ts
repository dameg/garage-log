import * as bcrypt from 'bcrypt';

import { UnauthorizedError } from '../../../shared/errors/unauthorized-error';
import { normalizeEmail, type User } from '../domain/user';
import type { UserRepository } from '../domain/user.repository';

import type { LoginUserInput } from './dto/login.dto';

export class LoginUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(input: LoginUserInput): Promise<User> {
    const email = normalizeEmail(input.email);

    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return user;
  }
}
