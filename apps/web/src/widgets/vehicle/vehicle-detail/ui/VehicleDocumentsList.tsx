import { useEffect, useRef } from 'react';
import { Badge, Card, Center, Group, Loader, SimpleGrid, Stack, Text, Timeline, Title } from '@mantine/core';
import {
  IconArrowDown,
  IconFileCertificate,
  IconFileInvoice,
} from '@tabler/icons-react';

import { EmptyState } from '@/shared/ui/empty-state/EmptyState';
import { ErrorAlert } from '@/shared/ui/error-alert/ErrorAlert';

import { useVehicleDocuments,type VehicleDocument } from '@/entities/vehicle';

type Props = {
  vehicleId: string;
};

type VehicleDocumentCardProps = {
  vehicleDocument: VehicleDocument;
};

const timelineBulletIcons = {
  inspection: IconFileCertificate,
  insurance: IconFileInvoice,
};

const documentTypeLabels: Record<VehicleDocument['type'], string> = {
  inspection: 'Inspection',
  insurance: 'Insurance',
};

function formatDate(value: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCost(value: number | null) {
  if (value == null) return null;

  return value.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;

  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Stack>
  );
}

function VehicleDocumentCard({ vehicleDocument }: VehicleDocumentCardProps) {
  const validFrom = formatDate(vehicleDocument.validFrom);
  const validTo = formatDate(vehicleDocument.validTo);
  const issuedAt = formatDate(vehicleDocument.issuedAt);
  const createdAt = formatDate(vehicleDocument.createdAt);
  const cost = formatCost(vehicleDocument.cost);

  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" gap="sm" wrap="wrap">
          <Stack gap={4}>
            <Text fw={700}>{vehicleDocument.title}</Text>
            <Text size="sm" c="dimmed">
              Added {createdAt}
            </Text>
          </Stack>

          <Badge variant="light" radius="sm">
            {documentTypeLabels[vehicleDocument.type]}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="sm">
          <DetailRow label="Valid from" value={validFrom} />
          <DetailRow label="Valid to" value={validTo} />
          <DetailRow label="Issued at" value={issuedAt} />
          <DetailRow label="Issuer" value={vehicleDocument.issuer} />
          <DetailRow label="Cost" value={cost} />
        </SimpleGrid>

        {vehicleDocument.note && (
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Note
            </Text>
            <Text size="sm">{vehicleDocument.note}</Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export function VehicleDocumentsList({ vehicleId }: Props) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useVehicleDocuments(vehicleId);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const vehicleDocuments = data?.pages.flatMap((group) => group.data) ?? [];

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

  if (vehicleDocuments.length === 0) {
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

      <Timeline active={vehicleDocuments.length} bulletSize={40} lineWidth={3}>
        {vehicleDocuments.map((vehicleDocument) => {
          const BulletIcon = timelineBulletIcons[vehicleDocument.type];

          return (
            <Timeline.Item
              key={vehicleDocument.id}
              bullet={<BulletIcon size={18} stroke={1.8} />}
              title={null}
            >
              <VehicleDocumentCard vehicleDocument={vehicleDocument} />
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
