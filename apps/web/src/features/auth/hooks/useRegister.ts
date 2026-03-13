import { useMutation } from '@tanstack/react-query';
import { authMutations } from '../queries/auth.mutations';

export function useRegister() {
  return useMutation(authMutations.register());
}
