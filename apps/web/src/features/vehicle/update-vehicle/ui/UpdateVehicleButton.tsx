import { Button } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
};

export function UpdateVehicleButton({ onClick }: Props) {
  return (
    <Button onClick={onClick} leftSection={<IconEdit size={16} />} radius="md">
      Edit vehicle
    </Button>
  );
}
