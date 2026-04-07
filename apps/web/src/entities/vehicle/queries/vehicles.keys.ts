import type { VehiclesListParams } from '../types';

export const vehiclesKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehiclesKeys.all, 'list'] as const,
  list: (params: VehiclesListParams) => [...vehiclesKeys.lists(), params] as const,
  detail: (id: string) => [...vehiclesKeys.all, 'detail', id] as const,
};
