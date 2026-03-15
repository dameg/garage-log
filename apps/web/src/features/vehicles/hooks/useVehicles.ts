import { useQuery } from '@tanstack/react-query';
import { vehiclesQueries } from '../queries/vehicles.queries';
import type { VehiclesListParams } from '../types';

export const useVehicles = (params: VehiclesListParams) => {
  return useQuery(vehiclesQueries.list(params));
};
