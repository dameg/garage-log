import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { routes } from '@/app/routes';
import { authMutations } from '../../../../entities/auth/model/auth.mutations';
import { authKeys } from '../../../../entities/auth/model/auth.keys';

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
