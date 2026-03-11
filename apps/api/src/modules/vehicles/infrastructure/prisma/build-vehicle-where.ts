import { VehicleListQuery } from '../../domain/vehicle-list.query';

export function buildVehicleWhere(query: VehicleListQuery) {
  const { ownerId, filters } = query;

  return {
    ownerId,
    ...(filters?.search && {
      OR: [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive' as const,
          },
        },
        {
          model: {
            contains: filters.search,
            mode: 'insensitive' as const,
          },
        },
        {
          make: {
            contains: filters.search,
            mode: 'insensitive' as const,
          },
        },
      ],
    }),

    ...((filters?.mileageFrom !== undefined || filters?.mileageTo !== undefined) && {
      mileage: {
        ...(filters?.mileageFrom !== undefined && { gte: filters.mileageFrom }),
        ...(filters?.mileageTo !== undefined && { lte: filters.mileageTo }),
      },
    }),
    ...((filters?.yearFrom !== undefined || filters?.yearTo !== undefined) && {
      year: {
        ...(filters?.yearFrom !== undefined && { gte: filters.yearFrom }),
        ...(filters?.yearTo !== undefined && { lte: filters.yearTo }),
      },
    }),
  };
}
