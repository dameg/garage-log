import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../queries/vehicles.mutations';
import { vehiclesKeys } from '../queries/vehicles.keys';
import type { VehiclesListParams } from '../types';
import { notifications } from '@mantine/notifications';

export function useDeleteVehicle(params: VehiclesListParams) {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.deleteVehicle(),
    onSuccess: async (_, id) => {
      await queryClient.removeQueries({
        queryKey: vehiclesKeys.detail(id),
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.list(params),
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
