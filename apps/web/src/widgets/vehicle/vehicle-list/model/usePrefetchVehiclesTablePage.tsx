import { useQueryClient } from '@tanstack/react-query';
import { vehiclesQueries } from '../../../../entities/vehicle/queries/vehicles.queries';
import type { VehiclesListParams } from '../../../../entities/vehicle/types';
import { useEffect } from 'react';

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

    queryClient.prefetchQuery(vehiclesQueries.list(nextParams));
  }, [pageIndex, totalPages, params, queryClient]);
}
