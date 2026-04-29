export const documentLogKeys = {
  all: ['document-logs'] as const,
  lists: () => [...documentLogKeys.all, 'list'] as const,
  list: (vehicleId: string) => [...documentLogKeys.lists(), vehicleId] as const,
};
