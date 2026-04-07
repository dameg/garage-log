import { mutationOptions } from '@tanstack/react-query';
import { createVehicle, deleteVehicle, updateVehicle } from '../api';

export const vehiclesMutations = {
  createVehicle: () =>
    mutationOptions({
      mutationFn: createVehicle,
    }),
  updateVehicle: () =>
    mutationOptions({
      mutationFn: updateVehicle,
    }),
  deleteVehicle: () =>
    mutationOptions({
      mutationFn: deleteVehicle,
    }),
};
