export const vehicleDocumentKeys = {
  all: ['vehicle-documents'] as const,
  lists: () => [...vehicleDocumentKeys.all, 'list'] as const,
  list: (vehicleId: string) => [...vehicleDocumentKeys.lists(), vehicleId] as const,
};
