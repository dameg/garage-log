import { VehicleForm } from '@/entities/vehicle/ui/VehicleForm';
import { Modal } from '@mantine/core';
import { useCreateVehicle } from '../model/useCreateVehicle';
import type { CreateVehicleInput } from '@/entities/vehicle/types';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function CreateVehicleDialog({ opened, onClose }: Props) {
  const { mutateAsync, isPending } = useCreateVehicle();

  const handleSubmit = async (values: CreateVehicleInput) => {
    await mutateAsync(values);
    onClose();
  };

  return (
    <Modal title="Create Vehicle" opened={opened} onClose={onClose} centered size={'lg'}>
      <VehicleForm
        vehicle={null}
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        onClose={onClose}
      />
    </Modal>
  );
}
