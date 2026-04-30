import { Container, Stack } from '@mantine/core';

import { AppLoader, ErrorAlert, NotFound } from '@/shared/ui';

import { useVehicle } from '@/entities/vehicle';

import { VehicleDocumentsList } from './VehicleDocumentsList';
import { VehicleHeader } from './VehicleHeader';
import { VehicleInfo } from './VehicleInfo';

type Props = {
  vehicleId: string;
};
export function VehicleDetailWidget({ vehicleId }: Props) {
  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);

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

  if (!vehicle) return <NotFound />;

  return (
    <Container size="xl" py="lg">
      <Stack gap="xl">
        <VehicleHeader vehicle={vehicle} />
        <VehicleInfo vehicle={vehicle} />
        <VehicleDocumentsList vehicleId={vehicle.id} />
      </Stack>
    </Container>
  );
}
