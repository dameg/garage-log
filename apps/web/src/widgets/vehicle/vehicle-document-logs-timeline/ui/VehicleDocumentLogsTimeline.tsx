import { useEffect, useRef } from 'react';
import {
  Center,
  Loader,
  Stack,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import {
  IconArrowDown,
  IconFileCertificate,
  IconFileInvoice,
} from '@tabler/icons-react';

import { EmptyState } from '@/shared/ui/empty-state/EmptyState';
import { ErrorAlert } from '@/shared/ui/error-alert/ErrorAlert';

import { useDocumentLogs } from '@/entities/document-log';

import { DocumentLogTimelineItem } from './DocumentLogTimelineItem';

type Props = {
  vehicleId: string;
};

const timelineBulletIcons = {
  inspection: IconFileCertificate,
  insurance: IconFileInvoice,
};

export function VehicleDocumentLogsTimeline({ vehicleId }: Props) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useDocumentLogs(vehicleId);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const documentLogs = data?.pages.flatMap((group) => group.data) ?? [];

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

  if (status === 'pending') {
    return (
      <Center py="xl">
        <Loader size="md" />
      </Center>
    );
  }

  if (status === 'error') {
    return (
      <ErrorAlert
        title="Failed to load document timeline"
        message={error.message || 'Please try again in a moment.'}
      />
    );
  }

  if (documentLogs.length === 0) {
    return (
      <EmptyState
        title="No document entries yet"
        description="Once you add the first document, its validity history will appear here."
        icon={<IconFileCertificate size={40} stroke={1.7} />}
      />
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={3}>Document timeline</Title>
        <Text c="dimmed">
          Insurance and inspection history displayed chronologically with automatic infinite
          loading.
        </Text>
      </Stack>

      <Timeline active={documentLogs.length} bulletSize={40} lineWidth={3}>
        {documentLogs.map((documentLog) => {
          const BulletIcon = timelineBulletIcons[documentLog.type];

          return (
            <Timeline.Item
              key={documentLog.id}
              bullet={<BulletIcon size={18} stroke={1.8} />}
              title={null}
            >
              <DocumentLogTimelineItem documentLog={documentLog} />
            </Timeline.Item>
          );
        })}

        {!hasNextPage && (
          <Timeline.Item bullet={<IconArrowDown size={18} stroke={1.8} />} title={null}>
            <Text size="sm" c="dimmed">
              Timeline start
            </Text>
          </Timeline.Item>
        )}
      </Timeline>

      {isFetchingNextPage && (
        <Center py="xs">
          <Loader size="sm" />
        </Center>
      )}

      <div ref={loadMoreRef} />
    </Stack>
  );
}
