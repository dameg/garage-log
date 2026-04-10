import { useMutation } from '@tanstack/react-query';

import { authMutations } from '@/entities/auth';

export function useRegister() {
  return useMutation(authMutations.register());
}
