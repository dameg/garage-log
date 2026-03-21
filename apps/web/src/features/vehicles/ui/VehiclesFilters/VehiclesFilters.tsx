import { Button, Group, NumberInput, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import {
  vehicleRangeFiltersSchema,
  type VehicleRangeFilters,
  type VehicleRangeFiltersFormValues,
} from '../../types';

type Props = {
  searchInput: string;
  onSearchChange: (value: string) => void;
  initialValues: VehicleRangeFilters;
  onSubmit: (values: VehicleRangeFilters) => void;
  onReset: () => void;
};

export function VehiclesFilters({
  searchInput,
  onSearchChange,
  initialValues,
  onSubmit,
  onReset,
}: Props) {
  const form = useForm<VehicleRangeFiltersFormValues>({
    initialValues,
    validate: zod4Resolver(vehicleRangeFiltersSchema),
  });

  return (
    <Stack gap="md">
      <TextInput
        label="Search"
        name="search"
        autoComplete="off"
        placeholder="Search by VIN, brand, model…"
        w={{ base: '100%', sm: 'calc(50% - var(--mantine-spacing-md) / 2)' }}
        value={searchInput}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />

      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(vehicleRangeFiltersSchema.parse(values));
        })}
      >
        <Stack gap="md">
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Year
            </Text>

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
              <NumberInput
                label="From"
                name="yearFrom"
                autoComplete="off"
                inputMode="numeric"
                placeholder="2010"
                hideControls
                {...form.getInputProps('yearFrom')}
              />

              <NumberInput
                label="To"
                name="yearTo"
                autoComplete="off"
                inputMode="numeric"
                placeholder="2020"
                hideControls
                {...form.getInputProps('yearTo')}
              />
            </SimpleGrid>
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Mileage
            </Text>

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
              <NumberInput
                label="From"
                name="mileageFrom"
                autoComplete="off"
                inputMode="numeric"
                placeholder="50 000"
                thousandSeparator=" "
                hideControls
                {...form.getInputProps('mileageFrom')}
              />

              <NumberInput
                label="To"
                name="mileageTo"
                autoComplete="off"
                inputMode="numeric"
                placeholder="150 000"
                thousandSeparator=" "
                hideControls
                {...form.getInputProps('mileageTo')}
              />
            </SimpleGrid>
          </Stack>

          <Group justify="flex-end">
            <Button
              type="button"
              variant="default"
              onClick={() => {
                form.reset();
                onReset();
              }}
            >
              Reset
            </Button>

            <Button type="submit">Apply filters</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
