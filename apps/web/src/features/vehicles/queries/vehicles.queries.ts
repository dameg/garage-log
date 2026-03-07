import { queryOptions } from '@tanstack/react-query';
import { getVehicles, getVehicle } from '../api';
import { vehiclesKeys } from './vehicles.keys';

export const vehiclesQueries = {
  list: () =>
    queryOptions({
      queryKey: vehiclesKeys.list(),
      queryFn: getVehicles,
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
