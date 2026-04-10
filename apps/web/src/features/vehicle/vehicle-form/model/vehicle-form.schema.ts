import { z } from 'zod';

export const vehicleFormSchema = z.object({
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.number().int().min(1886, 'Invalid year'),
  mileage: z.number().int().min(0, 'Mileage cannot be negative'),
  vin: z.string().trim().min(1, 'VIN is required'),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
