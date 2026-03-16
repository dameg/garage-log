import { http } from '@/shared/api/httpClient';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  Vehicle,
  VehiclesListParams,
  VehiclesResponse,
} from './types';

export function getVehicles(params: VehiclesListParams) {
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

  return http<VehiclesResponse>(`/vehicles?${searchParams.toString()}`, {
    method: 'GET',
  });
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((response) =>
    response.json(),
  );
  return res;
}

export async function createVehicle(payload: CreateVehicleInput) {
  return http<VehiclesResponse>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateVehicle(payload: UpdateVehicleInput) {
  return http(`/vehicles/${payload.id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
