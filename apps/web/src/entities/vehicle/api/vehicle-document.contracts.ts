import type { CursorPaginatedResult } from '@/shared/api';

import type { VehicleDocument } from '../model';

export type CreateVehicleDocumentInput = {
  type: VehicleDocument['type'];
  title: string;
  issuer?: string;
  validFrom: string;
  validTo: string;
  issuedAt?: string;
  cost?: number;
  note?: string;
};

export type UpdateVehicleDocumentPayload = Partial<CreateVehicleDocumentInput>;

export type VehicleDocumentListCursor = {
  createdAt: string;
  id: string;
};

export type VehicleDocumentListParams = {
  limit: number;
  createdAt?: string;
  id?: string;
};

export type VehicleDocumentListResponse = CursorPaginatedResult<
  VehicleDocument,
  VehicleDocumentListCursor
>;
