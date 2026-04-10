import { queryOptions } from '@tanstack/react-query';

import { getDocumentLogs } from '../api';

export const documentLogsQueries = {
  list: (vehicleId: string) =>
    queryOptions({
      queryKey: ['documentLogs', vehicleId],
      queryFn: () => getDocumentLogs(vehicleId),
      placeholderData: (previousData) => previousData,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    }),
};
