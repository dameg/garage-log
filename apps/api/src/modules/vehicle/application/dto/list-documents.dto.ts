export type ListDocumentsInput = {
  ownerId: string;
  vehicleId: string;
  createdAt?: Date;
  id?: string;
  limit: number;
};
