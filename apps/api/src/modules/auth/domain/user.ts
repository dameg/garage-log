import { normalizeRequiredString } from '@/shared/domain';

export type UserId = string;

export type User = {
  id: UserId;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export type CreateUserProps = Omit<User, 'createdAt'> & {
  createdAt?: Date;
};

export function normalizeEmail(value: string) {
  return normalizeRequiredString('User email', value).toLowerCase();
}

export function createUser(props: CreateUserProps): User {
  const email = normalizeEmail(props.email);
  const passwordHash = normalizeRequiredString('User password hash', props.passwordHash);

  return {
    id: props.id,
    email: email,
    passwordHash: passwordHash,
    createdAt: props.createdAt ?? new Date(),
  };
}
