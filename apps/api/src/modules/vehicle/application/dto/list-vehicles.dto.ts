import type { VehicleSortField } from '../../contracts/vehicle-list.query';

import type { SortDirection } from '@/shared/contracts';

export type ListVehiclesInput = {
  ownerId: string;
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
  page: number;
  limit: number;
  sortBy: VehicleSortField;
  direction: SortDirection;
};
