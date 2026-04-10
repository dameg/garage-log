import { useRequiredParam } from '@/shared/lib/router';
import { useVehicle } from '@/entities/vehicle';
import { VehicleDetail } from '@/widgets/vehicle/vehicle-detail';

export function VehicleDetailPage() {
  const vehicleId = useRequiredParam('id');

  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading vehicle details.</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  return <VehicleDetail vehicle={vehicle} />;
}
