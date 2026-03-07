import { createUser, normalizeEmail, User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import type { RegisterUserInput } from './dto/register.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConflictError } from '../../../shared/errors/conflict-error';

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
