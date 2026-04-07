import { useQuery } from '@tanstack/react-query';
import type { VehiclesListParams } from '../types';
import { vehiclesQueries } from '../queries/vehicles.queries';

export function useVehicles(params: VehiclesListParams) {
  return useQuery(vehiclesQueries.list(params));
}
