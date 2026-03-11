import { z } from 'zod';

export const vehicleIdParamsSchema = z.object({
  id: z.string().uuid(),
});
