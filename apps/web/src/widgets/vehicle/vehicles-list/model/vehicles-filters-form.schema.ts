import { z } from 'zod';

const optionalNumberFilter = (schema: z.ZodNumber) =>
  z
    .union([z.literal(''), schema])
    .optional()
    .transform((value) => (value === '' ? undefined : value));

export const vehiclesFiltersFormSchema = z
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
        code: 'custom',
        path: ['mileageFrom'],
        message: '`Mileage from` cannot be greater than `Mileage to`',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['mileageTo'],
        message: '`Mileage to` cannot be lower than `Mileage from`',
      });
    }
  });

export type VehiclesFiltersFormValues = z.input<typeof vehiclesFiltersFormSchema>;
export type VehiclesFiltersFormOutput = z.output<typeof vehiclesFiltersFormSchema>;
