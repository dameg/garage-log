import { Flex, Title } from '@mantine/core';

import type { Vehicle } from '@/entities/vehicle';

import { DeleteVehicleAction } from '@/features/vehicle/delete-vehicle';
import { UpdateVehicleAction } from '@/features/vehicle/update-vehicle';

type Props = {
  vehicle: Vehicle;
};
export function VehicleHeader({ vehicle }: Props) {
  return (
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
  );
}
