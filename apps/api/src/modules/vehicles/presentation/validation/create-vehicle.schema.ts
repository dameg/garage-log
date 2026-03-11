import { z } from 'zod';

export const createVehicleHttpSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
  mileage: z.number().int(),
});

export type CreateVehicleBody = z.infer<typeof createVehicleHttpSchema>;
