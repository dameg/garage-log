import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../../../../entities/vehicle/queries/vehicles.mutations';
import { vehiclesKeys } from '../../../../entities/vehicle/queries/vehicles.keys';
import type { UpdateVehicleInput } from '../../../../entities/vehicle/types';
import { notifications } from '@mantine/notifications';

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.updateVehicle(),
    onSuccess: async (vehicle, variables: UpdateVehicleInput) => {
      queryClient.setQueryData(vehiclesKeys.detail(variables.id), vehicle);

      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.lists(),
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
