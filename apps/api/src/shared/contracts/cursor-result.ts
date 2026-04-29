export type CursorResult<T> = {
  data: T[];
  nextCursor: string | null;
};
