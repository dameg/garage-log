import type { DocumentType } from '../../domain/document';

export type CreateDocumentInput = {
  vehicleId: string;
  ownerId: string;
  type: DocumentType;
  title: string;
  issuer?: string | null;
  validFrom: Date;
  validTo: Date;
  issuedAt?: Date | null;
  cost?: number | null;
  note?: string | null;
};
