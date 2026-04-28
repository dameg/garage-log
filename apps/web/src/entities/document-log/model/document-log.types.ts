export const documentLogTypes = ['insurance', 'inspection'] as const;

export type DocumentLogType = (typeof documentLogTypes)[number];

export type DocumentLog = {
  id: string;
  vehicleId: string;
  ownerId: string;
  type: DocumentLogType;
  title: string;
  issuer: string | null;
  validFrom: string;
  validTo: string;
  issuedAt: string | null;
  cost: number | null;
  note: string | null;
  createdAt: string;
};

export type DocumentLogResponse = DocumentLog;
