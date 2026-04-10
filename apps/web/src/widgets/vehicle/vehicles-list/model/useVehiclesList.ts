import { useQuery } from '@tanstack/react-query';

import { vehicleQueries, type VehiclesListParams } from '@/entities/vehicle';

export function useVehiclesList(params: VehiclesListParams) {
  return useQuery({
    ...vehicleQueries.list(params),
  });
}
