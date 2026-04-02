import type { Vehicle } from '../../domain/vehicle';
import type { VehicleListQuery } from '../../domain/vehicle-list.query';

export function sortVehicles(vehicles: Vehicle[], query: VehicleListQuery): Vehicle[] {
  const { field, direction } = query.sort;

  return [...vehicles].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
