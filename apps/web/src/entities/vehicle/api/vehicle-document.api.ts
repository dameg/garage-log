import { http } from '@/shared/api/httpClient';

import type {
  VehicleDocumentListParams,
  VehicleDocumentListResponse,
} from './vehicle-document.contracts';

export const getVehicleDocuments = (vehicleId: string, params: VehicleDocumentListParams) => {
  const searchParams = new URLSearchParams();

  if (params.createdAt) searchParams.set('createdAt', params.createdAt);
  if (params.id) searchParams.set('id', params.id);

  searchParams.set('limit', String(params.limit));

  return http<VehicleDocumentListResponse>(`/vehicles/${vehicleId}/documents?${searchParams}`, {
    method: 'GET',
  });
};
