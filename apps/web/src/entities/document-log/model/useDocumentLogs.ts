import { useQuery } from '@tanstack/react-query';

import { documentLogQueries } from './document-log.queries';

export const useDocumentLogs = (vehicleId: string) => {
  return useQuery({ ...documentLogQueries.list(vehicleId) });
};
