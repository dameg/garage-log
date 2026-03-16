import { Button, NumberInput, TextInput, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { vehicleSchema, type Vehicle, type VehicleFormValues } from '../../types';

type Props = {
  mode: 'create' | 'edit';
  vehicle: Vehicle | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
};

const EMPTY_VALUES: VehicleFormValues = {
  vin: '',
  brand: '',
  model: '',
  year: undefined,
  mileage: undefined,
};

export function VehicleForm({ mode, vehicle, isSubmitting, onSubmit, onClose }: Props) {
  console.log(vehicle);
  const form = useForm<VehicleFormValues>({
    initialValues:
      mode === 'create'
        ? EMPTY_VALUES
        : vehicle
          ? {
              vin: vehicle.vin,
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              mileage: vehicle.mileage,
            }
          : EMPTY_VALUES,
    validate: zod4Resolver(vehicleSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
