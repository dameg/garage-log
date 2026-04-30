import type { VehicleDocumentType } from '../model';

export const vehicleDocumentTypeLabels: Record<VehicleDocumentType, string> = {
  inspection: 'Inspection',
  insurance: 'Insurance',
};

export function getVehicleDocumentTypeLabel(type: VehicleDocumentType) {
  return vehicleDocumentTypeLabels[type];
}
