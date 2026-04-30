import { useInfiniteQuery } from '@tanstack/react-query';

import { vehicleDocumentQueries } from './vehicle-document.queries';

export const useVehicleDocuments = (vehicleId: string) => {
  return useInfiniteQuery(vehicleDocumentQueries.list(vehicleId));
};
