import { queryOptions } from '@tanstack/react-query';

import { getVehicle, getVehicles, type VehiclesListParams } from '../api';

import { vehicleKeys } from './vehicle.keys';

export const vehicleQueries = {
  list: (params: VehiclesListParams) =>
    queryOptions({
      queryKey: vehicleKeys.list(params),
      queryFn: () => getVehicles(params),
      placeholderData: (previousData) => previousData,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: vehicleKeys.detail(id),
      queryFn: () => getVehicle(id),
      staleTime: 0,
      retry: 3,
    }),
};
