import { Button, Divider, Group, NumberInput, TextInput } from '@mantine/core';
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
    <>
      <TextInput
        label="Search"
        placeholder="Search by VIN, Brand, Model..."
        value={searchInput}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />
      <Divider my="md" />
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(vehicleRangeFiltersSchema.parse(values));
        })}
      >
        <Group align="end" wrap="wrap">
          <NumberInput
            label="Year from"
            placeholder="e.g. 2010"
            {...form.getInputProps('yearFrom')}
          />

          <NumberInput label="Year to" placeholder="e.g. 2020" {...form.getInputProps('yearTo')} />

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

          <Button
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
      </form>
    </>
  );
}
