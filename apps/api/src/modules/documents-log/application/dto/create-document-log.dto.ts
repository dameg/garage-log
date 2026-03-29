import { DocumentLogType } from '../../domain/document-log';

export type CreateDocumentLogInput = {
  vehicleId: string;
  ownerId: string;
  type: DocumentLogType;
  title: string;
  issuer?: string | null;
  validFrom: Date;
  validTo: Date;
  issuedAt?: Date | null;
  cost?: number | null;
  note?: string | null;
};
