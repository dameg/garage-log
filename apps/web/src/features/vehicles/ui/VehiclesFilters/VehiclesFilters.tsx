import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  vehicleFiltersSchema,
  type VehicleFilters,
  type VehicleFiltersFormValues,
} from '../../types';
import { IconCalendar, IconGauge, IconSearch } from '@tabler/icons-react';

type Props = {
  initialValues: VehicleFilters;
  onSubmit: (values: VehicleFilters) => void;
  onReset: () => void;
};

export function VehiclesFilters({ initialValues, onSubmit, onReset }: Props) {
  const form = useForm<VehicleFiltersFormValues>({
    initialValues,
    validate: zod4Resolver(vehicleFiltersSchema),
  });

  return (
    <Stack gap="lg">
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(vehicleFiltersSchema.parse(values));
        })}
      >
        <Stack gap="lg">
          <Group align="flex-end" gap="lg" wrap="wrap">
            <Stack gap="xs" style={{ flex: 1, minWidth: 220 }}>
              <Group grow align="flex-start" gap="sm" wrap="nowrap">
                <TextInput
                  label="Search"
                  name="search"
                  autoComplete="off"
                  placeholder="Search by VIN, brand, model..."
                  size="sm"
                  radius="md"
                  w="100%"
                  leftSection={<IconSearch size={16} stroke={1.8} />}
                  {...form.getInputProps('search')}
                />
                <NumberInput
                  label="Year from"
                  name="yearFrom"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 2010"
                  size="sm"
                  radius="md"
                  hideControls
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  {...form.getInputProps('yearFrom')}
                />

                <NumberInput
                  label="Year to"
                  name="yearTo"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 2020"
                  size="sm"
                  radius="md"
                  hideControls
                  leftSection={<IconCalendar size={16} stroke={1.8} />}
                  {...form.getInputProps('yearTo')}
                />
              </Group>
            </Stack>

            <Stack gap="xs" style={{ flex: 1, minWidth: 220 }}>
              <Group grow align="flex-start" gap="sm" wrap="nowrap">
                <NumberInput
                  label="Mileage from"
                  name="mileageFrom"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 50 000"
                  size="sm"
                  radius="md"
                  thousandSeparator=" "
                  hideControls
                  leftSection={<IconGauge size={16} stroke={1.8} />}
                  {...form.getInputProps('mileageFrom')}
                />

                <NumberInput
                  label="Mileage to"
                  name="mileageTo"
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="eg. 150 000"
                  size="sm"
                  radius="md"
                  thousandSeparator=" "
                  hideControls
                  leftSection={<IconGauge size={16} stroke={1.8} />}
                  {...form.getInputProps('mileageTo')}
                />
              </Group>
            </Stack>
          </Group>

          <Group justify="flex-end" gap="sm">
            <Button
              type="button"
              variant="default"
              radius="md"
              onClick={() => {
                onReset();
              }}
            >
              Reset
            </Button>
            <Button type="submit" radius="md">
              Apply filters
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
