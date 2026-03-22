export type DocumentLogSortField =
  | 'createdAt'
  | 'title'
  | 'issuer'
  | 'validForm'
  | 'validTo'
  | 'issuedAt'
  | 'cost';

export type SortDirection = 'asc' | 'desc';

export type VehicleFilters = {
  type?: string;
  issuer?: string;
  costFrom?: number;
  costTo?: number;
};

export type DocumentLogListQuery = {
  ownerId: string;
  filters?: VehicleFilters;
  page: number;
  limit: number;
  sort: {
    field: DocumentLogSortField;
    direction: SortDirection;
  };
};
