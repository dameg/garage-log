// import { AppLoader, EmptyState, ErrorAlert } from '@/shared/ui';

import { useEffect, useRef } from 'react';

import { useDocumentLogs } from '@/entities/document-log';

type Props = {
  vehicleId: string;
};
export function VehicleDocumentLogsTimeline({ vehicleId }: Props) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useDocumentLogs(vehicleId);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // if (isLoading) {
  //   return <AppLoader />;
  // }

  // if (isError)
  //   return (
  //     <ErrorAlert
  //       title="Unable to load vehicle"
  //       message="An error occurred while loading your vehicle. Please try again later."
  //     />
  //   );

  // if (!documentLogs)
  //   return (
  //     <EmptyState
  //       title="No documents yet"
  //       description="Add your first document to start tracking everything."
  //     />
  //   );

  useEffect(() => {
    const el = loadMoreRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '10px',
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <div key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.title}</p>
          ))}
        </div>
      ))}
      <div ref={loadMoreRef} />

      {isFetchingNextPage && <div>Loading more...</div>}

      {!hasNextPage && data.pages.length > 0 && <div>Nie ma więcej wpisów</div>}
    </>
  );
}
