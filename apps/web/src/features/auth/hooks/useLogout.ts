import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authMutations } from '../queries/auth.mutations';
import { authKeys } from '../queries/auth.keys';
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
