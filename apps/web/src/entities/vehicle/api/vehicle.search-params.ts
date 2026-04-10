import type { VehiclesListParams } from './vehicle.contracts';

export function buildVehiclesSearchParams(params: VehiclesListParams): string {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set('search', params.search);
  if (params.mileageFrom != null) searchParams.set('mileageFrom', String(params.mileageFrom));
  if (params.mileageTo != null) searchParams.set('mileageTo', String(params.mileageTo));
  if (params.yearFrom != null) searchParams.set('yearFrom', String(params.yearFrom));
  if (params.yearTo != null) searchParams.set('yearTo', String(params.yearTo));

  searchParams.set('page', String(params.page));
  searchParams.set('limit', String(params.limit));
  searchParams.set('sortBy', params.sortBy);
  searchParams.set('direction', params.direction);

  return searchParams.toString();
}
