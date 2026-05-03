import type { MantineColor } from '@mantine/core';

import type { VehicleDocumentType } from '../model';

type VehicleDocumentTypeBadgeProps = {
  color: MantineColor;
  variant: 'light' | 'filled' | 'default';
};
const vehicleDocumentTypeBadgeProps: Record<VehicleDocumentType, VehicleDocumentTypeBadgeProps> = {
  inspection: {
    color: 'violet',
    variant: 'light',
  },

  insurance: {
    color: 'green',
    variant: 'light',
  },
};

const defaultVehicleDocuemntTypeBadgeProps = { color: 'gray', variant: 'filled' };

export function getVehicleDocumentTypeBadgeProps(
  type: VehicleDocumentType,
): VehicleDocumentTypeBadgeProps {
  return vehicleDocumentTypeBadgeProps[type] ?? defaultVehicleDocuemntTypeBadgeProps;
}
