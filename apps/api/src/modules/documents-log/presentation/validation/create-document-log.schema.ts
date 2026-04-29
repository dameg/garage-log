import { z } from 'zod';

import { documentLogTypes } from '../../domain/document-log';

export const createDocumentLogHttpSchema = z.object({
  type: z.enum(documentLogTypes),
  title: z.string().min(1),
  issuer: z.string().optional(),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
  issuedAt: z.coerce.date().optional(),
  cost: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
});

export type CreateDocumentLogBody = z.infer<typeof createDocumentLogHttpSchema>;
