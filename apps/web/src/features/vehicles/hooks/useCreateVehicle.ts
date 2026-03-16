import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../queries/vehicles.mutations';
import { vehiclesKeys } from '../queries/vehicles.keys';

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    ...vehiclesMutations.createVehicle(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.lists() });
    },
  });
}
