import type { UserRepository } from '../contracts/user.repository';

import type { CurrentUserInput } from './dto/current-user.dto';

import { UnauthorizedError } from '@/shared/errors';

export class GetCurrentUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  public async execute(input: CurrentUserInput) {
    const user = await this.repo.findById(input.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  }
}
