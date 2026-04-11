import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
};

export function DeleteVehicleButton({ onClick }: Props) {
  return (
    <Button onClick={onClick} leftSection={<IconTrash size={16} />} radius="md" color="red">
      Delete vehicle
    </Button>
  );
}
