import { z } from 'zod';

export const createVehicleSchema = z.object({
  vin: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
  mileage: z.number().int(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
