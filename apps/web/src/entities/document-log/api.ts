import { http } from '@/shared/api';

export async function getDocumentLogs(vehicleId: string) {
  return http<any>(`/vehicles/${vehicleId}/document-logs`, {
    method: 'GET',
  });
}
