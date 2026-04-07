import { useQuery } from '@tanstack/react-query';
import { documentLogsQueries } from '../queries/document-logs.queries';

export function useDocumentLogs(vehicleId: string) {
  return useQuery(documentLogsQueries.list(vehicleId));
}
