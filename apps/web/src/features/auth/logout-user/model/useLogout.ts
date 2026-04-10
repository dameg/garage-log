import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authKeys, authMutations } from '@/entities/auth';

import { routes } from '@/app/routes';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      navigate(routes.login.build(), { replace: true });
    },
  });
}
