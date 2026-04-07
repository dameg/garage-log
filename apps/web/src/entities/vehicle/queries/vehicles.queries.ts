import { queryOptions } from '@tanstack/react-query';
import { getVehicles, getVehicle } from '../api';
import { vehiclesKeys } from './vehicles.keys';
import type { VehiclesListParams } from '../types';

export const vehiclesQueries = {
  list: (params: VehiclesListParams) =>
    queryOptions({
      queryKey: vehiclesKeys.list(params),
      queryFn: () => getVehicles(params),
      placeholderData: (previousData) => previousData,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: vehiclesKeys.detail(id),
      queryFn: () => getVehicle(id),
      staleTime: 0,
      retry: 3,
    }),
};
