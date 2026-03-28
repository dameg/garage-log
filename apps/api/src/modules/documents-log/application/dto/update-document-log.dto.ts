import type { UpdateDocumentLogPatch } from '../../domain/document-log';

export type UpdateDocumentLogInput = {
  id: string;
  ownerId: string;
  patch: UpdateDocumentLogPatch;
};
