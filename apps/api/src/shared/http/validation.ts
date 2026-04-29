import type { z } from 'zod';

export const parseParams = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> =>
  schema.parse(data);

export const parseBody = parseParams;
export const parseQuery = parseParams;
