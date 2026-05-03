import type { SortDirection } from '@/shared/contracts';

export type VehicleSortField = 'createdAt' | 'brand' | 'model' | 'year' | 'mileage';

export type VehicleFilters = {
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
};

export type VehicleListQuery = {
  ownerId: string;
  filters?: VehicleFilters;
  page: number;
  limit: number;
  sort: {
    field: VehicleSortField;
    direction: SortDirection;
  };
};
