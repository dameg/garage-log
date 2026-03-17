import { Anchor, Button, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import { classes } from '../AuthForm';
import { useLogin } from '../../hooks/useLogin';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { loginSchema } from '../../types';
import { Link } from 'react-router-dom';
import { routes } from '@/app/routes';

export function RegisterForm() {
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
        Register
      </Title>

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
        {...form.getInputProps('email')}
      />
      <PasswordInput
        label="Password"
        placeholder="Your password"
        mt="md"
        radius="md"
        {...form.getInputProps('password')}
      />

      <Button fullWidth mt="xl" radius="md" type="submit">
        Sign up
      </Button>
    </form>
  );
}
