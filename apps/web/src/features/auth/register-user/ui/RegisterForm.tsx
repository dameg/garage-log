import { Anchor, Button, PasswordInput, TextInput, Title, Text } from '@mantine/core';

import { Link } from 'react-router-dom';

import { routes } from '@/app/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '../model/register.schema';

type Props = {
  onSubmit: (values: RegisterInput) => void;
};

export function RegisterUserForm({ onSubmit }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title ta="center">Register</Title>

      <Text ta="center" c="dimmed" mt="sm" size="sm">
        You already have an account yet?{' '}
        <Anchor component={Link} to={routes.login.build()} size="sm">
          Sign in
        </Anchor>
      </Text>

      <TextInput
        label="Email"
        placeholder="you@example.com"
        mt="xl"
        radius="md"
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        radius="md"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button fullWidth mt="xl" radius="md" type="submit">
        Sign up
      </Button>
    </form>
  );
}
