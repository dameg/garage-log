import { http } from '@/shared/api/httpClient';

import type { DocumentLogResponse } from '../model';

import type { CreateDocumentLogInput } from './document-log.contracts';

export const getDocumentLogs = (vehicleId: string) => {
  return http<DocumentLogResponse[]>(`/vehicles/${vehicleId}/document-logs`, {
    method: 'GET',
  });
};

export const getDocumentLog = (vehicleId: string, documentLogId: string) => {
  return http<DocumentLogResponse>(`/vehicles/${vehicleId}/document-logs/${documentLogId}`, {
    method: 'GET',
  });
};

export const createDocumentLog = (vehicleId: string, payload: CreateDocumentLogInput) => {
  return http<DocumentLogResponse>(`/vehicles/${vehicleId}/document-logs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
