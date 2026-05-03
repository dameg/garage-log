import { z } from 'zod';

export const documentIdParamsSchema = z.object({
  documentId: z.string(),
});
