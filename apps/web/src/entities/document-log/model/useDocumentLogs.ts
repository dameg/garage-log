import { useInfiniteQuery } from '@tanstack/react-query';

import { documentLogQueries } from './document-log.queries';

export const useDocumentLogs = (vehicleId: string) => {
  return useInfiniteQuery(documentLogQueries.list(vehicleId));
};
