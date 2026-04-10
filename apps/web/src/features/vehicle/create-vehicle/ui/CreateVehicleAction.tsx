import { useDisclosure } from '@mantine/hooks';

import { CreateVehicleButton } from './CreateVehicleButton';
import { CreateVehicleDialog } from './CreateVehicleDialog';

export function CreateVehicleAction() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <CreateVehicleButton onClick={() => open()} />
      <CreateVehicleDialog opened={opened} onClose={close} />
    </>
  );
}
