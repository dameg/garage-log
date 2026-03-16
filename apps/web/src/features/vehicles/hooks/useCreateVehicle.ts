import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../queries/vehicles.mutations';
import { vehiclesKeys } from '../queries/vehicles.keys';
import type { VehiclesListParams } from '../types';

export function useCreateVehicle(params: VehiclesListParams) {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.createVehicle(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.list(params),
        exact: true,
      });
    },
  });
}
