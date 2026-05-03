export type DocumentCursor = {
  createdAt: Date;
  id: string;
};

export type DocumentsListQuery = {
  ownerId: string;
  vehicleId: string;
  cursor?: DocumentCursor;
  limit: number;
};
