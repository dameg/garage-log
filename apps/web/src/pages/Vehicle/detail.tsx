import { useRequiredParam } from '@/shared/lib/router';

import { VehicleDetailWidget } from '@/widgets/vehicle/vehicle-detail';

export function VehicleDetailPage() {
  const vehicleId = useRequiredParam('id');

  return <VehicleDetailWidget vehicleId={vehicleId} />;
}
