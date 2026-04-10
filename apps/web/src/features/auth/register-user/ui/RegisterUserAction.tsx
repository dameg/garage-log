import type { RegisterInput } from '../model/register.schema';
import { useRegister } from '../model/useRegister';
import { RegisterUserForm } from './RegisterForm';

export function RegisterUserAction() {
  const { mutateAsync } = useRegister();

  const handleSubmit = async (values: RegisterInput) => {
    await mutateAsync(values);
  };

  return <RegisterUserForm onSubmit={handleSubmit} />;
}
