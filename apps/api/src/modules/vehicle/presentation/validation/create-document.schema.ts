import { z } from 'zod';

import { documentTypes } from '../../domain/document';

export const createDocumentHttpSchema = z.object({
  type: z.enum(documentTypes),
  title: z.string().min(1),
  issuer: z.string().optional(),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
  issuedAt: z.coerce.date().optional(),
  cost: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
});

export type CreateDocumentBody = z.infer<typeof createDocumentHttpSchema>;
