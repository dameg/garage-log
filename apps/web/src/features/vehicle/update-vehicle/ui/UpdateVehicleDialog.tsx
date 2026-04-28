import { Modal } from '@mantine/core';

import type { Vehicle } from '@/entities/vehicle';

import type { VehicleFormValues } from '../../vehicle-form/model/vehicle-form.schema';
import { VehicleForm } from '../../vehicle-form/ui/VehicleForm';
import { useUpdateVehicle } from '../model/useUpdateVehicle';

type Props = {
  opened: boolean;
  onClose: () => void;
  onExited?: () => void;
  vehicle: Vehicle | null;
};

export function UpdateVehicleDialog({ opened, onClose, onExited, vehicle }: Props) {
  const { mutateAsync, isPending } = useUpdateVehicle();

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!vehicle) return;
    await mutateAsync({ vehicleId: vehicle.id, payload: values });
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
        defaultValues={{ ...vehicle }}
        onSubmit={handleSubmit}
        onClose={onClose}
        isSubmitting={isPending}
        submitLabel="Update"
      />
    </Modal>
  );
}
