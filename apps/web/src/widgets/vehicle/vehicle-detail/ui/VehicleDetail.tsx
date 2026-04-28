import { Container, Divider, Flex, Stack, Text, Title } from '@mantine/core';

import type { Vehicle } from '@/entities/vehicle';

import { DeleteVehicleAction } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleAction } from '@/features/vehicle/update-vehicle';

type Props = {
  vehicle: Vehicle;
};

export function VehicleDetail({ vehicle }: Props) {
  const createdAt = new Date(vehicle.createdAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap="md"
        >
          <Title order={1}>
            {vehicle.brand} {vehicle.model}
          </Title>
          <Flex direction={{ base: 'column', xs: 'row' }} gap="sm">
            <DeleteVehicleAction vehicle={vehicle} />
            <UpdateVehicleAction vehicle={vehicle} />
          </Flex>
        </Flex>

        <Stack gap={0}>
          <Stack gap={8} py="md">
            <Text size="sm" c="dimmed">
              ID
            </Text>
            <Text fz="lg" fw={600}>
              {vehicle.id}
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
              VIN
            </Text>
            <Text fz="lg" fw={600}>
              {vehicle.vin}
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
      </Stack>
    </Container>
  );
}
