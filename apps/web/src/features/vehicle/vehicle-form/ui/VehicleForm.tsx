import { vehicleFormSchema, type VehicleFormValues } from '../model/vehicle-form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';

type Props = {
  defaultValues?: Partial<VehicleFormValues>;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function VehicleForm({
  defaultValues,
  onSubmit,
  onClose,
  isSubmitting = false,
  submitLabel = 'Save',
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      brand: defaultValues?.brand ?? '',
      model: defaultValues?.model ?? '',
      year: defaultValues?.year ?? new Date().getFullYear(),
      mileage: defaultValues?.mileage ?? 0,
      vin: defaultValues?.vin ?? '',
    },
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Brand"
          placeholder="BMW"
          error={errors.brand?.message}
          {...register('brand')}
        />

        <TextInput
          label="Model"
          placeholder="330d"
          error={errors.model?.message}
          {...register('model')}
        />

        <Controller
          control={control}
          name="year"
          render={({ field }) => (
            <NumberInput
              label="Year"
              error={errors.year?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <Controller
          control={control}
          name="mileage"
          render={({ field }) => (
            <NumberInput
              label="Mileage"
              error={errors.mileage?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <TextInput
          label="VIN"
          placeholder="WB..."
          error={errors.vin?.message}
          {...register('vin')}
        />

        <Group mt="md">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
