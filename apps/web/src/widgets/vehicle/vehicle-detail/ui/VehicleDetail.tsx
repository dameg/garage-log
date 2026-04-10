import { Container, SimpleGrid, Stack, Title } from '@mantine/core';
import { IconCalendarStats, IconCar, IconGauge } from '@tabler/icons-react';

import type { Vehicle } from '@/entities/vehicle';

import { DetailStat } from './DetailStat';

type Props = {
  vehicle: Vehicle;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
});

function getVehicleAgeLabel(year: number) {
  const age = Math.max(new Date().getFullYear() - year, 0);
  return age === 0 ? 'Current year model' : `${age} years on the road`;
}

export function VehicleDetail({ vehicle }: Props) {
  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>
            {vehicle.brand} {vehicle.model}
          </Title>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <DetailStat
            label="Model year"
            value={vehicle.year}
            description={getVehicleAgeLabel(vehicle.year)}
            icon={IconCalendarStats}
          />
          <DetailStat
            label="Mileage"
            value={`${vehicle.mileage.toLocaleString()} km`}
            description="Current odometer reading"
            icon={IconGauge}
          />
          <DetailStat
            label="Record created"
            value={dateFormatter.format(new Date(vehicle.createdAt))}
            description="Stored in your garage log"
            icon={IconCar}
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
