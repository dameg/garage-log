import type { UpdateDocumentLogPatch } from '../../domain/document-log';

export type UpdateDocumentLogInput = {
  documentLogId: string;
  ownerId: string;
  patch: UpdateDocumentLogPatch;
};
