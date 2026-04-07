import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesMutations } from '../../../../entities/vehicle/queries/vehicles.mutations';
import { vehiclesKeys } from '../../../../entities/vehicle/queries/vehicles.keys';

import { notifications } from '@mantine/notifications';

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehiclesMutations.createVehicle(),
    onSuccess: async (createdVehicle) => {
      await queryClient.invalidateQueries({
        queryKey: vehiclesKeys.lists(),
        exact: true,
      });
      notifications.show({
        title: 'Success',
        message: `Vehicle ${createdVehicle.brand} ${createdVehicle.model} created`,
        color: 'green',
      });
    },
  });
}
