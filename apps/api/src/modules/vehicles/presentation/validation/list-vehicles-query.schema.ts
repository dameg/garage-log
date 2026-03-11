import { z } from 'zod';

export const listVehiclesQuerySchema = z
  .object({
    search: z.string().optional(),
    mileageFrom: z.coerce.number().int().nonnegative().optional(),
    mileageTo: z.coerce.number().int().nonnegative().optional(),

    yearFrom: z.coerce.number().int().gte(1886).optional(),
    yearTo: z.coerce.number().int().gte(1886).optional(),

    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),

    sortBy: z.enum(['createdAt', 'name', 'brand', 'model', 'year', 'mileage']).default('createdAt'),
    direction: z.enum(['asc', 'desc']).default('desc'),
  })
  .superRefine((data, ctx) => {
    if (
      data.mileageFrom !== undefined &&
      data.mileageTo !== undefined &&
      data.mileageFrom > data.mileageTo
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'mileageFrom must be <= mileageTo',
        path: ['mileageFrom'],
      });
    }

    if (data.yearFrom !== undefined && data.yearTo !== undefined && data.yearFrom > data.yearTo) {
      ctx.addIssue({
        code: 'custom',
        message: 'yearFrom must be <= yearTo',
        path: ['yearFrom'],
      });
    }
  });
