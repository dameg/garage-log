import { vehicleQueries, type VehiclesListParams } from '@/entities/vehicle';
import { useQuery } from '@tanstack/react-query';

export function useVehiclesList(params: VehiclesListParams) {
  return useQuery({
    ...vehicleQueries.list(params),
  });
}
