export type ListDocumentLogsInput = {
  ownerId: string;
  vehicleId: string;
  createdAt?: Date;
  id?: string;
  limit: number;
};
