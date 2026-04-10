import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notifications } from '@mantine/notifications';
import { vehicleKeys, vehicleMutations } from '@/entities/vehicle';

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehicleMutations.updateVehicle(),
    onSuccess: async (vehicle, variables) => {
      queryClient.setQueryData(vehicleKeys.detail(variables.id), vehicle);

      await queryClient.invalidateQueries({
        queryKey: vehicleKeys.lists(),
      });

      notifications.show({
        title: 'Success',
        message: 'Vehicle updated',
        color: 'green',
      });
    },
  });
}
