import { http } from '@/shared/api/httpClient';

import type { DocumentLogListParams, DocumentLogListResponse } from './document-log.contracts';

export const getDocumentLogs = (vehicleId: string, params: DocumentLogListParams) => {
  const searchParams = new URLSearchParams();

  if (params.createdAt) searchParams.set('createdAt', params.createdAt);
  if (params.id) searchParams.set('id', params.id);

  searchParams.set('limit', String(params.limit));

  return http<DocumentLogListResponse>(`/vehicles/${vehicleId}/document-logs?${searchParams}`, {
    method: 'GET',
  });
};
