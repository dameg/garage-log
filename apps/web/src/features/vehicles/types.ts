import type { PaginatedResult } from '@/shared/api';
import type { SortParams } from '@/shared/types';

export type Vehicle = {
  id: string;
  ownerId: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: Date;
};

export type VehiclesResponse = PaginatedResult<Vehicle>;

export type VehiclesSortBy = 'createdAt' | 'vin' | 'brand' | 'model' | 'year' | 'mileage';

export type VehiclesListParams = SortParams<VehiclesSortBy> & {
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
  page: number;
  limit: number;
};
