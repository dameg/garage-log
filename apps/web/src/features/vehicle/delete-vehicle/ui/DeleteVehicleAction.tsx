import { useDisclosure } from '@mantine/hooks';

import type { Vehicle } from '@/entities/vehicle/model/vehicle.types';

import { DeleteVehicleButton } from './DeleteVehicleButton';
import { DeleteVehicleDialog } from './DeleteVehicleDialog';

type Props = {
  vehicle: Vehicle | null;
};

export function DeleteVehicleAction({ vehicle }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <DeleteVehicleButton onClick={() => open()} />
      <DeleteVehicleDialog opened={opened} onClose={close} vehicle={vehicle} />
    </>
  );
}
