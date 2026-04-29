export const documentLogKeys = {
  all: ['document-logs'] as const,
  lists: () => [...documentLogKeys.all, 'list'] as const,
  list: (vehicleId: string) => [...documentLogKeys.lists(), vehicleId] as const,
  detail: (id: string) => [...documentLogKeys.all, 'detail', id] as const,
};
