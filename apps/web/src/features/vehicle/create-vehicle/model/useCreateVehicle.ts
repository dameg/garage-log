import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { vehicleMutations, vehicleKeys } from '@/entities/vehicle';

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehicleMutations.createVehicle(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: vehicleKeys.lists(),
      });
      notifications.show({
        title: 'Success',
        message: `Vehicle created`,
        color: 'green',
      });
    },
  });
}
