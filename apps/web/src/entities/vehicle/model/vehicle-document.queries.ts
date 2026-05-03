import { infiniteQueryOptions } from '@tanstack/react-query';

import { getVehicleDocuments, type VehicleDocumentListCursor } from '../api';

import { vehicleDocumentKeys } from './vehicle-document.keys';

export const VEHICLE_DOCUMENTS_PAGE_SIZE = 3;

export const vehicleDocumentQueries = {
  list: (vehicleId: string) =>
    infiniteQueryOptions({
      queryKey: vehicleDocumentKeys.list(vehicleId),
      initialPageParam: null as VehicleDocumentListCursor | null,
      queryFn: ({ pageParam }) =>
        getVehicleDocuments(vehicleId, {
          limit: VEHICLE_DOCUMENTS_PAGE_SIZE,
          createdAt: pageParam?.createdAt,
          id: pageParam?.id,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};
