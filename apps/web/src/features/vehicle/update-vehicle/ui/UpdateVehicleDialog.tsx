import type { UpdateVehicleInput, Vehicle } from '@/entities/vehicle/types';
import { VehicleForm } from '@/entities/vehicle/ui/VehicleForm';
import { Modal } from '@mantine/core';

import { useUpdateVehicle } from '../model/useUpdateVehicle';

type Props = {
  opened: boolean;
  onClose: () => void;
  onExited: () => void;
  vehicle: Vehicle | null;
};

export function UpdateVehicleDialog({ opened, onClose, onExited, vehicle }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicle();

  const handleSubmit = async (values: UpdateVehicleInput) => {
    if (!vehicle) return;
    await mutateAsync(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={onExited}
      title={`Edit Vehicle`}
      centered
      size={'lg'}
    >
      <VehicleForm
        mode="edit"
        vehicle={vehicle}
        onSubmit={handleSubmit}
        onClose={onClose}
        isPending={isPending}
      />
    </Modal>
  );
}
