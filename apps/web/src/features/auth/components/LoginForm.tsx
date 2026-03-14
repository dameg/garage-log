import { Anchor, Button, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import classes from './AuthForm.module.css';
import { useLogin } from '../hooks/useLogin';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { loginSchema } from '../types';
import { Link } from 'react-router-dom';
import { routes } from '@/app/routes';

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zod4Resolver(loginSchema),
  });
  return (
    <form onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

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
        {...form.getInputProps('email')}
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        radius="md"
        {...form.getInputProps('password')}
      />

      {/* <Group justify="end" mt="lg">
        <Anchor component="button" size="sm">
          Forgot password?
        </Anchor>
      </Group> */}

      <Button fullWidth mt="xl" radius="md" type="submit">
        Sign in
      </Button>
    </form>
  );
}
