import type { SortDirection } from '../../../../shared/contracts/sort-direction';
import type { VehicleSortField } from '../../domain/vehicle-list.query';

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
