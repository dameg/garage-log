import { queryOptions } from '@tanstack/react-query';
import { authKeys } from './auth.keys';
import { me } from '../api';

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      queryFn: me,
      retry: 0,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
};
