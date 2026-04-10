import { useQuery } from '@tanstack/react-query';
import { vehiclesQueries } from '../../../../entities/vehicle/model/vehicle.queries';

export const useVehicle = (id: string) => {
  return useQuery({ ...vehiclesQueries.detail(id), enabled: !!id });
};
