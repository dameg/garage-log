import { Center, Loader, Text } from '@mantine/core';
import { useVehicle } from '../../hooks/useVehicle';

export function VehicleDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useVehicle(id);

  if (isLoading && !data) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return <Text c="red">Failed to load vehicle</Text>;
  }

  return (
    <div>
      <h1>Vehicle Detail</h1>
    </div>
  );
}
