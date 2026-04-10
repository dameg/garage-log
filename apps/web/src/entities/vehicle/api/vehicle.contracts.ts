import type { PaginationParams, SortParams } from '@/shared/types';
import type { Vehicle, VehiclesSortBy } from '../model';

export type CreateVehicleInput = {
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
};

export type UpdateVehiclePayload = Partial<CreateVehicleInput>;

export type UpdateVehicleInput = {
  id: Vehicle['id'];
  payload: UpdateVehiclePayload;
};

export type VehiclesListParams = SortParams<VehiclesSortBy> & {
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
} & PaginationParams;
