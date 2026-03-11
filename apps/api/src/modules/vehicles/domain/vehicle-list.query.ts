export type VehicleSortField = 'createdAt' | 'name' | 'brand' | 'model' | 'year' | 'mileage';

export type SortDirection = 'asc' | 'desc';

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
