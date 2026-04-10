import { http } from '@/shared/api/httpClient';
import type { Vehicle, VehicleResponse } from '../model';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehiclesListParams,
} from './vehicle.contracts';
import type { PaginatedResult } from '@/shared/api';
import { buildVehiclesSearchParams } from './vehicle.search-params';

export function getVehicles(params: VehiclesListParams) {
  const searchParams = buildVehiclesSearchParams(params);

  return http<PaginatedResult<VehicleResponse>>(`/vehicles?${searchParams}`, {
    method: 'GET',
  });
}

export async function getVehicle(id: Vehicle['id']) {
  return http<VehicleResponse>(`/vehicles/${id}`, {
    method: 'GET',
  });
}

export async function createVehicle(payload: CreateVehicleInput) {
  return http<VehicleResponse>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateVehicle({ id, payload }: UpdateVehicleInput) {
  return http<VehicleResponse>(`/vehicles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteVehicle(id: Vehicle['id']) {
  return http<void>(`/vehicles/${id}`, {
    method: 'DELETE',
  });
}
