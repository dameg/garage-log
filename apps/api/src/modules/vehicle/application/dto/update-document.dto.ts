import type { UpdateDocumentPatch } from '../../domain/document';

export type UpdateDocumentInput = {
  documentId: string;
  ownerId: string;
  vehicleId: string;
  patch: UpdateDocumentPatch;
};
