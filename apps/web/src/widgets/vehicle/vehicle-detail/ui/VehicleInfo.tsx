import { Divider, Stack, Text } from '@mantine/core';

import { formatDate } from '@/shared/lib/format/date';

import { type Vehicle } from '@/entities/vehicle';

type Props = {
  vehicle: Vehicle;
};

export function VehicleInfo({ vehicle }: Props) {
  const createdAt = formatDate(vehicle.createdAt);

  return (
    <Stack gap={0}>
      <Stack gap={8} py="md">
        <Text size="sm" c="dimmed">
          VIN
        </Text>
        <Text fz="lg" fw={600}>
          {vehicle.vin}
        </Text>
        <Divider mt="xs" />
      </Stack>
      <Stack gap={8} py="md">
        <Text size="sm" c="dimmed">
          Model year
        </Text>
        <Text fz="lg" fw={600}>
          {vehicle.year}
        </Text>
        <Divider mt="xs" />
      </Stack>

      <Stack gap={8} py="md">
        <Text size="sm" c="dimmed">
          Mileage
        </Text>
        <Text fz="lg" fw={600}>
          {vehicle.mileage.toLocaleString()} km
        </Text>
        <Divider mt="xs" />
      </Stack>

      <Stack gap={8} py="md">
        <Text size="sm" c="dimmed">
          Created at
        </Text>
        <Text fz="lg" fw={600}>
          {createdAt}
        </Text>
      </Stack>
    </Stack>
  );
}
