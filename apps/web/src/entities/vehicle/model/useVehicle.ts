import { useQuery } from '@tanstack/react-query';

import { type Vehicle,vehicleQueries } from '@/entities/vehicle';

export const useVehicle = (id: Vehicle['id']) => {
  return useQuery({ ...vehicleQueries.detail(id), enabled: !!id });
};
