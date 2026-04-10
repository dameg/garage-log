import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { IconCalendar, IconSearch } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';

import {
  type VehiclesFiltersFormOutput,
  vehiclesFiltersFormSchema,
  type VehiclesFiltersFormValues,
} from '../model/vehicles-filters-form.schema';

type Props = {
  filters: VehiclesFiltersFormOutput;
  onSubmit: (values: VehiclesFiltersFormOutput) => void;
  onReset: () => void;
};

export function VehiclesFiltersForm({ filters, onSubmit, onReset }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehiclesFiltersFormValues, unknown, VehiclesFiltersFormOutput>({
    defaultValues: {
      ...filters,
    },
    resolver: zodResolver(vehiclesFiltersFormSchema),
    mode: 'onBlur',
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Search"
              autoComplete="off"
              placeholder="Search by VIN, brand, model..."
              radius="md"
              leftSection={<IconSearch size={16} stroke={1.8} />}
              error={errors.search?.message}
              {...register('search')}
            />
          </Grid.Col>
        </Grid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Controller
              control={control}
              name="yearFrom"
              render={({ field }) => (
                <NumberInput
                  label="Year from"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 2010"
                  radius="md"
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.yearFrom?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Controller
              control={control}
              name="yearTo"
              render={({ field }) => (
                <NumberInput
                  label="Year to"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 2020"
                  radius="md"
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.yearTo?.message}
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Controller
              control={control}
              name="mileageFrom"
              render={({ field }) => (
                <NumberInput
                  label="Mileage from"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 50 000"
                  radius="md"
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.mileageFrom?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Controller
              control={control}
              name="mileageTo"
              render={({ field }) => (
                <NumberInput
                  label="Mileage to"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 150 000"
                  radius="md"
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.mileageTo?.message}
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" gap="sm">
          <Button
            type="button"
            variant="default"
            radius="md"
            onClick={() => {
              onReset();
              reset({
                search: '',
                yearFrom: undefined,
                yearTo: undefined,
                mileageFrom: undefined,
                mileageTo: undefined,
              });
            }}
          >
            Reset
          </Button>
          <Button type="submit" radius="md">
            Apply
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
