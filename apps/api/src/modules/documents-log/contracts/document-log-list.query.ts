export type DocumentLogListQuery = {
  ownerId: string;
  vehicleId: string;

  cursor?: {
    createdAt: Date;
    id: string;
  };
  limit: number;
};
