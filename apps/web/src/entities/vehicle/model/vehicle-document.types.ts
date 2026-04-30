export const vehicleDocumentTypes = ['insurance', 'inspection'] as const;

export type VehicleDocumentType = (typeof vehicleDocumentTypes)[number];

export type VehicleDocument = {
  id: string;
  vehicleId: string;
  ownerId: string;
  type: VehicleDocumentType;
  title: string;
  issuer: string | null;
  validFrom: string;
  validTo: string;
  issuedAt: string | null;
  cost: number | null;
  note: string | null;
  createdAt: string;
};

export type VehicleDocumentResponse = VehicleDocument;
