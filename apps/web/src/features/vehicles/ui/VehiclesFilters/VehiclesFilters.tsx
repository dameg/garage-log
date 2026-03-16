import { Button, Group, NumberInput, TextInput } from '@mantine/core';

type Props = {
  searchInput: string;
  onSearchChange: (value: string) => void;
  yearFrom?: number;
  yearTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  onYearFromChange: (value?: number) => void;
  onYearToChange: (value?: number) => void;
  onMileageFromChange: (value?: number) => void;
  onMileageToChange: (value?: number) => void;
  onReset: () => void;
};

export function VehiclesFilters({
  searchInput,
  onSearchChange,
  yearFrom,
  yearTo,
  mileageFrom,
  mileageTo,
  onYearFromChange,
  onYearToChange,
  onMileageFromChange,
  onMileageToChange,
  onReset,
}: Props) {
  return (
    <Group align="end" wrap="wrap">
      <TextInput
        label="Search"
        placeholder="Search by VIN, Brand, Model..."
        value={searchInput}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />

      <NumberInput
        label="Year from"
        placeholder="e.g. 2010"
        value={yearFrom}
        onChange={(value) => onYearFromChange(typeof value === 'number' ? value : undefined)}
      />

      <NumberInput
        label="Year to"
        placeholder="e.g. 2020"
        value={yearTo}
        onChange={(value) => onYearToChange(typeof value === 'number' ? value : undefined)}
      />

      <NumberInput
        label="Mileage from"
        placeholder="e.g. 50000"
        value={mileageFrom}
        onChange={(value) => onMileageFromChange(typeof value === 'number' ? value : undefined)}
      />

      <NumberInput
        label="Mileage to"
        placeholder="e.g. 150000"
        value={mileageTo}
        onChange={(value) => onMileageToChange(typeof value === 'number' ? value : undefined)}
      />

      <Button variant="default" onClick={onReset}>
        Reset
      </Button>
    </Group>
  );
}
