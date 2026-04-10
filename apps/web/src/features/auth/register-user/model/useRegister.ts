import { authMutations } from '@/entities/auth';
import { useMutation } from '@tanstack/react-query';

export function useRegister() {
  return useMutation(authMutations.register());
}
