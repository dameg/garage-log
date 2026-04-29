export type DocumentLogCursor = {
  createdAt: Date;
  id: string;
};

export type DocumentLogListQuery = {
  ownerId: string;
  vehicleId: string;
  cursor?: DocumentLogCursor;
  limit: number;
};
