import { VehicleDetail } from '@/features/vehicles';
import { useRequiredParam } from '@/shared/lib/router';

export function VehicleDetailPage() {
  const id = useRequiredParam('id');

  return <VehicleDetail id={id} />;
}
