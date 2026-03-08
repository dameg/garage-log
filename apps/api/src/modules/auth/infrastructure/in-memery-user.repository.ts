import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

export class InMemoryUserRepository implements UserRepository {
  private data: User[] = [];

  async create(user: User): Promise<User> {
    this.data.push(user);
    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.data.find((user) => user.email === email) || null;
  }
  async findById(id: string): Promise<User | null> {
    return this.data.find((user) => user.id === id) || null;
  }
}
