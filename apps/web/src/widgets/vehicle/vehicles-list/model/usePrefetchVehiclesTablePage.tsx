import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { vehicleQueries, type VehiclesListParams } from '@/entities/vehicle';

type Options = {
  params: VehiclesListParams;
  pageIndex: number;
  totalPages: number;
};

export function usePrefetchVehiclesTablePage({ params, pageIndex, totalPages }: Options) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPage = pageIndex + 2;

    if (nextPage > totalPages) return;

    const nextParams: VehiclesListParams = {
      ...params,
      page: nextPage,
    };

    queryClient.prefetchQuery(vehicleQueries.list(nextParams));
  }, [pageIndex, totalPages, params, queryClient]);
}
