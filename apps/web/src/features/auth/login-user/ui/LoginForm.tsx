import { Anchor, Button, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { routes } from '@/app/routes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../model/login.schema';

type Props = {
  onSubmit: (values: LoginInput) => void;
};
export function LoginUserForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title ta="center">Welcome back!</Title>

      <Text ta="center" c="dimmed" mt="sm" size="sm">
        Do not have an account yet?{' '}
        <Anchor component={Link} to={routes.register.build()} size="sm">
          Create account
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
        Sign in
      </Button>
    </form>
  );
}
