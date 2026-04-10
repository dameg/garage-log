import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { PaginatedResult } from '@/shared/api';

import { vehicleKeys, vehicleMutations, type VehicleResponse } from '@/entities/vehicle';

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    ...vehicleMutations.deleteVehicle(),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.lists() });
      await queryClient.cancelQueries({ queryKey: vehicleKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<PaginatedResult<VehicleResponse>>({
        queryKey: vehicleKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<VehicleResponse>(vehicleKeys.detail(id));

      queryClient.removeQueries({
        queryKey: vehicleKeys.detail(id),
        exact: true,
      });

      previousLists.forEach(([queryKey, queryData]) => {
        if (!queryData) return;
        const hasVehicle = queryData.data.some((vehicle) => vehicle.id === id);

        if (hasVehicle) {
          queryClient.setQueryData<PaginatedResult<VehicleResponse>>(queryKey, {
            ...queryData,
            data: queryData.data.filter((vehicle) => vehicle.id !== id),
            total: Math.max(0, queryData.total - 1),
          });
        }
      });

      return {
        previousLists,
        previousDetail,
      };
    },

    onError: (_error, id, context) => {
      context?.previousLists?.forEach(([queryKey, queryData]) => {
        queryClient.setQueryData(queryKey, queryData);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(vehicleKeys.detail(id), context.previousDetail);
      }

      notifications.show({
        title: 'Error',
        message: 'Failed to delete vehicle',
        color: 'red',
      });
    },
    onSuccess: async () => {
      notifications.show({
        title: 'Success',
        message: 'Vehicle deleted',
        color: 'green',
      });
    },
    onSettled: async (_data, _error, id) => {
      await queryClient.invalidateQueries({
        queryKey: vehicleKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: vehicleKeys.detail(id),
        exact: true,
      });
    },
  });
}
