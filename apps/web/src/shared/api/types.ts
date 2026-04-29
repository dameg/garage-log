export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type CursorPaginatedResult<T, TCursor> = {
  data: T[];
  nextCursor: TCursor | null;
};
