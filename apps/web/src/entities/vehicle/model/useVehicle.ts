import { useQuery } from '@tanstack/react-query';

import { vehicleQueries } from '@/entities/vehicle';

export const useVehicle = (id: string) => {
  return useQuery({ ...vehicleQueries.detail(id), enabled: !!id });
};
