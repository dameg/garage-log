import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../../../../entities/vehicle/queries/vehicles.mutations';
import { vehiclesKeys } from '../../../../entities/vehicle/queries/vehicles.keys';
import { notifications } from '@mantine/notifications';

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.deleteVehicle(),
    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: vehiclesKeys.detail(id),
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.lists(),
        exact: true,
      });
      notifications.show({
        title: 'Success',
        message: 'Vehicle deleted',
        color: 'green',
      });
    },
  });
}
