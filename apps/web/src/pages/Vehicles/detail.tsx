import { useRequiredParam } from '@/shared/lib/router';

export function VehicleDetailPage() {
  const vehicleId = useRequiredParam('id');

  return <>Details {vehicleId}</>;
}
