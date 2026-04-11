import { useRequiredParam } from '@/shared/lib/router';
import { AppLoader, EmptyState, ErrorAlert, NotFound } from '@/shared/ui';

import { useVehicle } from '@/entities/vehicle';

import { VehicleDetail } from '@/widgets/vehicle/vehicle-detail';

export function VehicleDetailPage() {
  const vehicleId = useRequiredParam('id');

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

  return <VehicleDetail vehicle={vehicle} />;
}
