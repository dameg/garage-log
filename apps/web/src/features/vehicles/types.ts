import type { PaginatedResult } from '@/shared/api';
import type { SortParams } from '@/shared/types';
import { z } from 'zod';

export type Vehicle = {
  id: string;
  ownerId: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: string;
};

export type VehiclesResponse = PaginatedResult<Vehicle>;

export type VehiclesSortBy = 'createdAt' | 'vin' | 'brand' | 'model' | 'year' | 'mileage';

export type VehiclesListParams = SortParams<VehiclesSortBy> & {
  search?: string;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: number;
  yearTo?: number;
  page: number;
  limit: number;
};

export const vehicleRangeFiltersSchema = z.object({
  yearFrom: z
    .union([z.literal(''), z.number().int().min(1886, 'Year must be at least 1886')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  yearTo: z
    .union([z.literal(''), z.number().int().min(1886, 'Year must be at least 1886')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  mileageFrom: z
    .union([z.literal(''), z.number().int().min(0, 'Mileage cannot be negative')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  mileageTo: z
    .union([z.literal(''), z.number().int().min(0, 'Mileage cannot be negative')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
});

export type VehicleRangeFilters = z.output<typeof vehicleRangeFiltersSchema>;
export type VehicleRangeFiltersFormValues = z.input<typeof vehicleRangeFiltersSchema>;

export const createVehicleSchema = z.object({
  vin: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int(),
  mileage: z.number().int(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export type UpdateVehicleInput = {
  id: Vehicle['id'];
  payload: CreateVehicleInput;
};
