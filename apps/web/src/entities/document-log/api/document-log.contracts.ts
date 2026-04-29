import type { CursorPaginatedResult } from '@/shared/api';

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

export type DocumentLogListCursor = {
  createdAt: string;
  id: string;
};

export type DocumentLogListParams = {
  limit: number;
  createdAt?: string;
  id?: string;
};

export type DocumentLogListResponse = CursorPaginatedResult<DocumentLog, DocumentLogListCursor>;
