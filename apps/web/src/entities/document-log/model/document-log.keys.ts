export const documentLogKeys = {
  all: ['document-logs'] as const,
  lists: () => [...documentLogKeys.all, 'list'] as const,
  list: (vehicleId: string, limit: number) => [...documentLogKeys.lists(), vehicleId, limit] as const,
};
