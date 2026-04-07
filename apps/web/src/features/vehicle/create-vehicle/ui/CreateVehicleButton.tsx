import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

type Props = {
  onClick: () => void;
};

export function CreateVehicleButton({ onClick }: Props) {
  return (
    <Button onClick={onClick} leftSection={<IconPlus size={16} />} radius="md">
      Create vehicle
    </Button>
  );
}
