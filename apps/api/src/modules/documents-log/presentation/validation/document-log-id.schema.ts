import { z } from 'zod';

export const documentLogIdParamsSchema = z.object({
  documentLogId: z.string(),
});
