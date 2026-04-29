import type { PaginationParams, SortParams } from '@/shared/types';

import type { VehiclesSortBy } from '../model';

export type CreateVehicleInput = {
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
};

export type UpdateVehiclePayload = Partial<CreateVehicleInput>;

export type UpdateVehicleInput = {
  vehicleId: string;
  payload: UpdateVehiclePayload;
};

export type VehiclesListParams = SortParams<VehiclesSortBy> & {
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
} & PaginationParams;
