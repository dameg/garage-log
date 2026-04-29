import { z } from 'zod';
export const listDocumentLogsQuerySchema = z
  .object({
    createdAt: z.coerce.date().optional(),
    id: z.string().min(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  .superRefine((data, ctx) => {
    const hasCreatedAt = data.createdAt !== undefined;
    const hasId = data.id !== undefined;

    if (hasCreatedAt !== hasId) {
      ctx.addIssue({
        code: 'custom',
        message: 'createdAt and id must be provided together',
        path: hasCreatedAt ? ['id'] : ['createdAt'],
      });
    }
  });
