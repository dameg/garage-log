import { Container, Flex, SimpleGrid, Stack, Title } from '@mantine/core';
import { IconCalendarStats, IconCar, IconGauge } from '@tabler/icons-react';

import type { Vehicle } from '@/entities/vehicle';

import { DeleteVehicleAction } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleAction } from '@/features/vehicle/update-vehicle';

import { VehicleDetailStat } from './VehicleDetailStat';

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

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <VehicleDetailStat
            label="Model year"
            value={vehicle.year}
            description={getVehicleAgeLabel(vehicle.year)}
            icon={IconCalendarStats}
          />
          <VehicleDetailStat
            label="Mileage"
            value={`${vehicle.mileage.toLocaleString()} km`}
            description="Current odometer reading"
            icon={IconGauge}
          />
          <VehicleDetailStat
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
