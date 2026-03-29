import { z } from 'zod';

export const vehicleIdParamsSchema = z.object({
  vehicleId: z.string(),
});
