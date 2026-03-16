import { Loader } from '@mantine/core';
import { useVehicle } from '../../hooks';
import { Text } from '@mantine/core';

export function VehicleDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useVehicle(id);

  if (isLoading && !data) {
    return <Loader />;
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
