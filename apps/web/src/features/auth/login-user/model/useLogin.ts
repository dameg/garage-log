import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/app/routes';
import { authKeys, authMutations } from '@/entities/auth';

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
