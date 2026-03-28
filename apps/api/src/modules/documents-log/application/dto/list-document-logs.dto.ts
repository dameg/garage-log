import { SortDirection } from '../../../../shared/domain/sort-direction';
import { DocumentLogType } from '../../domain/document-log';
import { DocumentLogSortField } from '../../domain/document-log-list.query';

export type ListDocumentLogsInput = {
  ownerId: string;
  search?: string;
  type?: DocumentLogType;
  issuer?: string;
  costFrom?: number;
  costTo?: number;
  hasCost?: boolean;
  issuedAtFrom?: Date;
  issuedAtTo?: Date;
  validFromFrom?: Date;
  validFromTo?: Date;
  validToFrom?: Date;
  validToTo?: Date;
  sortBy: DocumentLogSortField;
  direction: SortDirection;
  page: number;
  limit: number;
};
