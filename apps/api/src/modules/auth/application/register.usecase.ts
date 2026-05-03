import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import type { UserRepository } from '../contracts/user.repository';
import { createUser, normalizeEmail, type User } from '../domain/user';

import type { RegisterUserInput } from './dto/register.dto';

import { ConflictError } from '@/shared/errors';

export class RegisterUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = normalizeEmail(input.email);
    const existing = await this.repo.findByEmail(email);

    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = createUser({
      id: randomUUID(),
      email,
      passwordHash,
    });

    return this.repo.create(user);
  }
}
