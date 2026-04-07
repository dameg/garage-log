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

const optionalNumberFilter = (schema: z.ZodNumber) =>
  z
    .union([z.literal(''), schema])
    .optional()
    .transform((value) => (value === '' ? undefined : value));

export const vehicleFiltersSchema = z
  .object({
    search: z
      .string()
      .optional()
      .transform((value) => value?.trim() || undefined),
    yearFrom: optionalNumberFilter(z.number().int().min(1886, 'Year must be at least 1886')),
    yearTo: optionalNumberFilter(z.number().int().min(1886, 'Year must be at least 1886')),
    mileageFrom: optionalNumberFilter(z.number().int().min(0, 'Mileage cannot be negative')),
    mileageTo: optionalNumberFilter(z.number().int().min(0, 'Mileage cannot be negative')),
  })
  .superRefine((values, ctx) => {
    if (values.yearFrom != null && values.yearTo != null && values.yearFrom > values.yearTo) {
      ctx.addIssue({
        code: 'custom',
        path: ['yearFrom'],
        message: '`Year from` cannot be greater than `Year to`',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['yearTo'],
        message: '`Year to` cannot be lower than `Year from`',
      });
    }

    if (
      values.mileageFrom != null &&
      values.mileageTo != null &&
      values.mileageFrom > values.mileageTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mileageFrom'],
        message: '`Mileage from` cannot be greater than `Mileage to`',
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mileageTo'],
        message: '`Mileage to` cannot be lower than `Mileage from`',
      });
    }
  });

export type VehicleFilters = z.output<typeof vehicleFiltersSchema>;
export type VehicleFiltersFormValues = z.input<typeof vehicleFiltersSchema>;

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
