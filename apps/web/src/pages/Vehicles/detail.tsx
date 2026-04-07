// import { VehicleDetail } from '@/features/vehicles';
import { useRequiredParam } from '@/shared/lib/router';

export function VehicleDetailPage() {
  const vehicleId = useRequiredParam('id');

  // return <VehicleDetail vehicleId={vehicleId} />;
}
