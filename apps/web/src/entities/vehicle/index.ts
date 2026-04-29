export type {
  CreateVehicleInput,
  UpdateVehicleInput,
  UpdateVehiclePayload,
  VehiclesListParams,
} from './api';
export { createVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle } from './api';
export type { Vehicle, VehicleResponse, VehiclesSortBy } from './model';
export { useVehicle } from './model';
export { vehicleKeys, vehicleMutations, vehicleQueries } from './model';
