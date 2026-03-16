import { mutationOptions } from '@tanstack/react-query';
import { createVehicle, updateVehicle } from '../api';

export const vehiclesMutations = {
  createVehicle: () =>
    mutationOptions({
      mutationFn: createVehicle,
    }),
  updateVehicle: () =>
    mutationOptions({
      mutationFn: updateVehicle,
    }),
};
