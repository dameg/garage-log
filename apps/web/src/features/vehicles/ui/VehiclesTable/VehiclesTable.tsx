import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Button,
  Group,
  Loader,
  NumberInput,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';

import { columns } from './columns';
import { useVehicles } from '../../hooks/useVehicles';
import { useVehiclesTableSearchParams } from '../../hooks/useVehiclesTableSearchParams';
import { useVehiclesFiltersSearchParams } from '../../hooks/useVehiclesFiltersSearchParams';
import { useVehiclesSearch } from '../../hooks/useVehiclesSearch';

export function VehiclesTable() {
  const {
    params: tableParams,
    pagination,
    sorting,
    setPagination,
    setSorting,
  } = useVehiclesTableSearchParams();

  const { filters, setSearch, setYearFrom, setYearTo, setMileageFrom, setMileageTo, resetFilters } =
    useVehiclesFiltersSearchParams();

  const { searchInput, onSearchChange, resetSearch } = useVehiclesSearch(filters.search, setSearch);

  const params = {
    ...tableParams,
    ...filters,
  };
  const query = useVehicles(params);

  const data = query.data?.data ?? [];
  const totalItems = query.data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
    pageCount: totalPages,
  });

  if (query.isLoading && !query.data) {
    return <Loader />;
  }

  if (query.isError) {
    return <Text c="red">Failed to load vehicles</Text>;
  }

  return (
    <Stack>
      <Group align="end">
        <TextInput
          label="Search"
          placeholder="Search by name, brand, model..."
          value={searchInput}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
        <NumberInput
          label="Year from"
          placeholder="e.g. 2010"
          value={filters.yearFrom}
          onChange={(value) => setYearFrom(typeof value === 'number' ? value : undefined)}
        />

        <NumberInput
          label="Year to"
          placeholder="e.g. 2020"
          value={filters.yearTo}
          onChange={(value) => setYearTo(typeof value === 'number' ? value : undefined)}
        />

        <NumberInput
          label="Mileage from"
          placeholder="e.g. 50000"
          value={filters.mileageFrom}
          onChange={(value) => setMileageFrom(typeof value === 'number' ? value : undefined)}
        />

        <NumberInput
          label="Mileage to"
          placeholder="e.g. 150000"
          value={filters.mileageTo}
          onChange={(value) => setMileageTo(typeof value === 'number' ? value : undefined)}
        />

        <Button
          variant="default"
          onClick={() => {
            resetSearch();
            resetFilters();
          }}
        >
          Reset
        </Button>
      </Group>
      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <Group gap={6}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </Group>
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text ta="center" c="dimmed">
                    No vehicles found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Group justify="space-between" mt="md">
        <Text size="sm">
          Page {pagination.pageIndex + 1} of {Math.max(totalPages, 1)}
        </Text>

        <Group gap="xs">
          <Button
            variant="default"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(prev.pageIndex - 1, 0),
              }))
            }
            disabled={pagination.pageIndex === 0 || query.isFetching}
          >
            Prev
          </Button>

          <Button
            variant="default"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={pagination.pageIndex + 1 >= totalPages || query.isFetching}
          >
            Next
          </Button>
        </Group>
      </Group>
    </Stack>
  );
}
