import { type Icon, IconFile, IconFileCertificate, IconFileInvoice } from '@tabler/icons-react';

import type { VehicleDocumentType } from '../model';

const vehicleDocumentTypeIcons: Record<VehicleDocumentType, Icon> = {
  inspection: IconFileCertificate,
  insurance: IconFileInvoice,
};

export function getVehicleDocumentTypeIcon(type: VehicleDocumentType): Icon {
  return vehicleDocumentTypeIcons[type] ?? IconFile;
}
