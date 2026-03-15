export type SortDirection = 'asc' | 'desc';

export type SortParams<T extends string> = {
  sortBy: T;
  direction: SortDirection;
};
