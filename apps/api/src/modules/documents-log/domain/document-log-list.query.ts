import { SortDirection } from '../../../shared/domain/sort-direction';
import { DocumentLogType } from './document-log';

export type DocumentLogSortField =
  | 'createdAt'
  | 'title'
  | 'issuer'
  | 'validFrom'
  | 'validTo'
  | 'issuedAt'
  | 'cost';

export type DocumentLogFilters = {
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
};

export type DocumentLogListQuery = {
  ownerId: string;
  filters?: DocumentLogFilters;
  page: number;
  limit: number;
  sort: {
    field: DocumentLogSortField;
    direction: SortDirection;
  };
};
