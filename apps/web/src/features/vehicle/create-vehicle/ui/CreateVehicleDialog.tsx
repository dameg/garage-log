import { Modal } from '@mantine/core';

import { VehicleForm, type VehicleFormValues } from '@/features/vehicle/vehicle-form';

import { useCreateVehicle } from '../model/useCreateVehicle';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function CreateVehicleDialog({ opened, onClose }: Props) {
  const { mutateAsync, isPending } = useCreateVehicle();

  const handleSubmit = async (values: VehicleFormValues) => {
    await mutateAsync(values);
    onClose();
  };

  return (
    <Modal title="Create Vehicle" opened={opened} onClose={onClose} centered size={'lg'}>
      <VehicleForm
        onSubmit={handleSubmit}
        onClose={onClose}
        isSubmitting={isPending}
        submitLabel="Create"
      />
    </Modal>
  );
}
