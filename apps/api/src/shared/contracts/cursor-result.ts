export type CursorResult<TData, TCursor = string> = {
  data: TData[];
  nextCursor: TCursor | null;
};
