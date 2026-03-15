import { useQuery } from '@tanstack/react-query';
import { authQueries } from '../queries/auth.queries';

export function useAuth() {
  const query = useQuery(authQueries.me());

  return {
    user: query.data?.user ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data?.user,
  };
}
