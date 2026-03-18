import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../queries/vehicles.mutations';
import { vehiclesKeys } from '../queries/vehicles.keys';
import type { UpdateVehicleInput, VehiclesListParams } from '../types';
import { notifications } from '@mantine/notifications';
export function useUpdateVehicle(params: VehiclesListParams) {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.updateVehicle(),
    onSuccess: async (vehicle, variables: UpdateVehicleInput) => {
      queryClient.setQueryData(vehiclesKeys.detail(variables.id), vehicle);

      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.list(params),
        exact: true,
      });
      notifications.show({
        title: 'Success',
        message: 'Vehicle updated',
        color: 'green',
      });
    },
  });
}
