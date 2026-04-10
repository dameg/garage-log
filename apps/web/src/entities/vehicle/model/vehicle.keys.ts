import type { VehiclesListParams } from '../api';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (params: VehiclesListParams) => [...vehicleKeys.lists(), params] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};
