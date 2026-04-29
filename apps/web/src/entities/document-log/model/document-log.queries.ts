import { queryOptions } from '@tanstack/react-query';

import { getDocumentLogs } from '../api';

import { documentLogKeys } from './document-log.keys';

export const documentLogQueries = {
  list: (vehicleId: string) =>
    queryOptions({
      queryKey: documentLogKeys.list(vehicleId),
      queryFn: () => getDocumentLogs(vehicleId),
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    }),
};
