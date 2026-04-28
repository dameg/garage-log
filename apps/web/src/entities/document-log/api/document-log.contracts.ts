import type { DocumentLog } from '../model';

export type CreateDocumentLogInput = {
  type: DocumentLog['type'];
  title: string;
  issuer?: string;
  validFrom: string;
  validTo: string;
  issuedAt?: string;
  cost?: number;
  note?: string;
};

export type UpdateDocumentLogPayload = Partial<CreateDocumentLogInput>;
