import { Button, Divider, Group, NumberInput, SimpleGrid, Stack, TextInput } from '@mantine/core';
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
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl" verticalSpacing="md">
        <TextInput
          label="Search"
          placeholder="Search by VIN, Brand, Model..."
          value={searchInput}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />

        <form
          onSubmit={form.onSubmit((values) => {
            onSubmit(vehicleRangeFiltersSchema.parse(values));
          })}
        >
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
              <NumberInput
                label="Year from"
                placeholder="e.g. 2010"
                {...form.getInputProps('yearFrom')}
              />

              <NumberInput
                label="Year to"
                placeholder="e.g. 2020"
                {...form.getInputProps('yearTo')}
              />

              <NumberInput
                label="Mileage from"
                placeholder="e.g. 50000"
                {...form.getInputProps('mileageFrom')}
              />

              <NumberInput
                label="Mileage to"
                placeholder="e.g. 150000"
                {...form.getInputProps('mileageTo')}
              />
            </SimpleGrid>

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

              <Button type="submit">Filter</Button>
            </Group>
          </Stack>
        </form>
      </SimpleGrid>

      <Divider />
    </Stack>
  );
}
