import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../queries/vehicles.mutations';
import { vehiclesKeys } from '../queries/vehicles.keys';

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    ...vehiclesMutations.updateVehicle(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: vehiclesKeys.lists() });
    },
  });
}
