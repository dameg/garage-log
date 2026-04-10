import { Button, Group, Modal, Text } from '@mantine/core';

import type { Vehicle } from '@/entities/vehicle';

import { useDeleteVehicle } from '../model/useDeleteVehicle';

type Props = {
  opened: boolean;
  onClose: () => void;
  onExited: () => void;
  vehicle: Vehicle | null;
};

export function DeleteVehicleDialog({ opened, onClose, onExited, vehicle }: Props) {
  const { isPending, mutateAsync } = useDeleteVehicle();

  const handleConfirmDelete = async () => {
    if (!vehicle) return;
    await mutateAsync(vehicle.id);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExited}
      title="Delete Vehicle"
      centered
      size={'lg'}
    >
      {vehicle ? (
        <Text>{`Delete ${vehicle.brand} ${vehicle.model} (VIN: ${vehicle.vin})?`}</Text>
      ) : null}
      <Group mt="md">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button color="red" loading={isPending} onClick={handleConfirmDelete} disabled={!vehicle}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
