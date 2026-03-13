import { useMutation } from '@tanstack/react-query';
import { authMutations } from '../queries/auth.mutations';

export function useLogin() {
  return useMutation(authMutations.login());
}
