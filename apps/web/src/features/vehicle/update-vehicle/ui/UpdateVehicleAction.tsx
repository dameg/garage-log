import { useDisclosure } from '@mantine/hooks';

import type { Vehicle } from '@/entities/vehicle/model/vehicle.types';

import { UpdateVehicleButton } from './UpdateVehicleButton';
import { UpdateVehicleDialog } from './UpdateVehicleDialog';

type Props = {
  vehicle: Vehicle | null;
};

export function UpdateVehicleAction({ vehicle }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <UpdateVehicleButton onClick={() => open()} />
      <UpdateVehicleDialog opened={opened} onClose={close} vehicle={vehicle} />
    </>
  );
}
