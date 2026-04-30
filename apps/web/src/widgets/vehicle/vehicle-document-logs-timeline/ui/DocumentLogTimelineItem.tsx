import { Badge, Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';

import type { DocumentLog } from '@/entities/document-log';

type Props = {
  documentLog: DocumentLog;
};

const documentTypeLabels: Record<DocumentLog['type'], string> = {
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

export function DocumentLogTimelineItem({ documentLog }: Props) {
  const validFrom = formatDate(documentLog.validFrom);
  const validTo = formatDate(documentLog.validTo);
  const issuedAt = formatDate(documentLog.issuedAt);
  const createdAt = formatDate(documentLog.createdAt);
  const cost = formatCost(documentLog.cost);

  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" gap="sm" wrap="wrap">
          <Stack gap={4}>
            <Text fw={700}>{documentLog.title}</Text>
            <Text size="sm" c="dimmed">
              Added {createdAt}
            </Text>
          </Stack>

          <Badge variant="light" radius="sm">
            {documentTypeLabels[documentLog.type]}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="sm">
          <DetailRow label="Valid from" value={validFrom} />
          <DetailRow label="Valid to" value={validTo} />
          <DetailRow label="Issued at" value={issuedAt} />
          <DetailRow label="Issuer" value={documentLog.issuer} />
          <DetailRow label="Cost" value={cost} />
        </SimpleGrid>

        {documentLog.note && (
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
              Note
            </Text>
            <Text size="sm">{documentLog.note}</Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
