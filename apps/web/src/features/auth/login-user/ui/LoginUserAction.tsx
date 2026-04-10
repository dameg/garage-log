import type { LoginInput } from '../model/login.schema';
import { useLogin } from '../model/useLogin';

import { LoginUserForm } from './LoginForm';

export function LoginUserAction() {
  const { mutateAsync } = useLogin();

  const handleSubmit = async (values: LoginInput) => {
    await mutateAsync(values);
  };

  return <LoginUserForm onSubmit={handleSubmit} />;
}
