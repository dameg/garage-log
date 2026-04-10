export { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } from './api';

export type { VehiclesListParams, CreateVehicleInput, UpdateVehicleInput } from './api';

export { vehicleKeys, vehicleQueries, vehicleMutations } from './model';

export type { Vehicle, VehicleResponse, VehiclesSortBy } from './model';
