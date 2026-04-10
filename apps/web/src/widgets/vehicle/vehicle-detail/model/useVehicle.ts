import { vehicleQueries, type Vehicle } from '@/entities/vehicle';
import { useQuery } from '@tanstack/react-query';

export const useVehicle = (id: Vehicle['id']) => {
  return useQuery({ ...vehicleQueries.detail(id), enabled: !!id });
};
