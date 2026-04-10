import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authKeys, authMutations } from '@/entities/auth';

import { routes } from '@/app/routes';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    ...authMutations.login(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      navigate(routes.vehicles.build(), { replace: true });
    },
  });
}
