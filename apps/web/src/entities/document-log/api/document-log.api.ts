import { http } from '@/shared/api/httpClient';

import type { Vehicle } from '@/entities/vehicle';

import type { DocumentLog, DocumentLogResponse } from '../model';

import type { CreateDocumentLogInput } from './document-log.contracts';

export const getDocumentLogs = (vehicleId: Vehicle['id']) => {
  return http<DocumentLogResponse[]>(`/vehicles/${vehicleId}/document-logs`, {
    method: 'GET',
  });
};

export const getDocumentLog = (vehicleId: Vehicle['id'], documentLogId: DocumentLog['id']) => {
  return http<DocumentLogResponse>(`/vehicles/${vehicleId}/document-logs/${documentLogId}`, {
    method: 'GET',
  });
};

export const createDocumentLog = (vehicleId: Vehicle['id'], payload: CreateDocumentLogInput) => {
  return http<DocumentLogResponse>(`/vehicles/${vehicleId}/document-logs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
