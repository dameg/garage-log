import { AppLoader, EmptyState, ErrorAlert } from '@/shared/ui';

import { useDocumentLogs } from '@/entities/document-log';

type Props = {
  vehicleId: string;
};
export function DocumentLogsTimeline({ vehicleId }: Props) {
  const { data: documentLogs, isError, isLoading } = useDocumentLogs(vehicleId);

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError)
    return (
      <ErrorAlert
        title="Unable to load vehicle"
        message="An error occurred while loading your vehicle. Please try again later."
      />
    );

  if (!documentLogs)
    return (
      <EmptyState
        title="No documents yet"
        description="Add your first document to start tracking everything."
      />
    );

  return <>Timeline!</>;
}
