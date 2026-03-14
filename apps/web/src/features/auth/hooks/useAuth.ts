import { useQuery } from '@tanstack/react-query';
import { authQueries } from '../queries/auth.queries';

export function useAuth() {
  const query = useQuery(authQueries.me());

  return {
    user: query.data,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
  };
}
