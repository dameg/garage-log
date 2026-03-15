import { Vehicle } from '../../../modules/vehicles/domain/vehicle';
import { VehicleListQuery } from '../../../modules/vehicles/domain/vehicle-list.query';

export function matchesVehicleFilters(vehicle: Vehicle, query: VehicleListQuery): boolean {
  const { ownerId, filters } = query;

  if (vehicle.ownerId !== ownerId) return false;

  if (filters?.search) {
    const q = filters.search.toLowerCase();

    const searchable = [vehicle.model, vehicle.brand].map((v) => v.toLowerCase());

    if (!searchable.some((field) => field.includes(q))) {
      return false;
    }
  }

  if (filters?.mileageFrom !== undefined && vehicle.mileage < filters.mileageFrom) {
    return false;
  }

  if (filters?.mileageTo !== undefined && vehicle.mileage > filters.mileageTo) {
    return false;
  }

  if (filters?.yearFrom !== undefined && vehicle.year < filters.yearFrom) {
    return false;
  }

  if (filters?.yearTo !== undefined && vehicle.year > filters.yearTo) {
    return false;
  }

  return true;
}
