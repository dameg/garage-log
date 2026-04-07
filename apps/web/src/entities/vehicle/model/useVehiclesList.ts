import { useQuery } from '@tanstack/react-query';
import type { VehiclesListParams } from '../types';
import { vehiclesQueries } from '../queries/vehicles.queries';

export function useVehiclesList(params: VehiclesListParams) {
  return useQuery({
    ...vehiclesQueries.list(params),
    select: (response) => ({
      items: response.data,
      total: response.total,
    }),
  });
}
