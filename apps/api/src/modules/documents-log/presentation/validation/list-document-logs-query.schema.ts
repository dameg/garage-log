import { z } from 'zod';
import { documentLogTypes } from '../../domain/document-log';

const documentLogSortFields = [
  'createdAt',
  'title',
  'issuer',
  'validFrom',
  'validTo',
  'issuedAt',
  'cost',
] as const;

export const listDocumentLogsQuerySchema = z
  .object({
    search: z.string().optional(),
    type: z.enum(documentLogTypes).optional(),
    issuer: z.string().optional(),
    costFrom: z.coerce.number().nonnegative().optional(),
    costTo: z.coerce.number().nonnegative().optional(),
    hasCost: z.stringbool().optional(),
    issuedAtFrom: z.coerce.date().optional(),
    issuedAtTo: z.coerce.date().optional(),
    validFromFrom: z.coerce.date().optional(),
    validFromTo: z.coerce.date().optional(),
    validToFrom: z.coerce.date().optional(),
    validToTo: z.coerce.date().optional(),

    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),

    sortBy: z.enum(documentLogSortFields).default('createdAt'),
    direction: z.enum(['asc', 'desc']).default('desc'),
  })
  .superRefine((data, ctx) => {
    if (data.costFrom !== undefined && data.costTo !== undefined && data.costFrom > data.costTo) {
      ctx.addIssue({
        code: 'custom',
        message: 'costFrom must be <= costTo',
        path: ['costFrom'],
      });
    }

    if (
      data.issuedAtFrom !== undefined &&
      data.issuedAtTo !== undefined &&
      data.issuedAtFrom > data.issuedAtTo
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'issuedAtFrom must be <= issuedAtTo',
        path: ['issuedAtFrom'],
      });
    }

    if (
      data.validFromFrom !== undefined &&
      data.validFromTo !== undefined &&
      data.validFromFrom > data.validFromTo
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'validFromFrom must be <= validFromTo',
        path: ['validFromFrom'],
      });
    }

    if (
      data.validToFrom !== undefined &&
      data.validToTo !== undefined &&
      data.validToFrom > data.validToTo
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'validToFrom must be <= validToTo',
        path: ['validToFrom'],
      });
    }
  });
