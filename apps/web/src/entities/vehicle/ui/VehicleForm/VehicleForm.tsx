import { Button, NumberInput, TextInput, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { createVehicleSchema, type Vehicle } from '../../../../entities/vehicle/types';

type VehicleFormValues = {
  vin: string;
  brand: string;
  model: string;
  year: number | undefined;
  mileage: number | undefined;
};

const EMPTY_VALUES: VehicleFormValues = {
  vin: '',
  brand: '',
  model: '',
  year: undefined,
  mileage: undefined,
};

function getInitialValues(vehicle: Vehicle | null): VehicleFormValues {
  if (!vehicle) {
    return EMPTY_VALUES;
  }

  return {
    vin: vehicle.vin,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
  };
}

type Props = {
  mode: 'create' | 'edit';
  vehicle: Vehicle | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
};

export function VehicleForm({ mode, vehicle, isPending, onSubmit, onClose }: Props) {
  const form = useForm<VehicleFormValues>({
    initialValues: mode === 'create' ? EMPTY_VALUES : getInitialValues(vehicle),
    validate: zod4Resolver(createVehicleSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(createVehicleSchema.parse(values));
      })}
    >
      <Stack>
        <TextInput
          label="VIN"
          placeholder="e.g. 7PB4MVCXD3PR45211"
          {...form.getInputProps('vin')}
        />
        <TextInput label="Brand" placeholder="e.g. BMW" {...form.getInputProps('brand')} />
        <TextInput label="Model" placeholder="e.g. E46 330d" {...form.getInputProps('model')} />
        <NumberInput label="Year" placeholder="e.g. 2005" {...form.getInputProps('year')} />
        <NumberInput label="Mileage" placeholder="e.g. 245000" {...form.getInputProps('mileage')} />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
