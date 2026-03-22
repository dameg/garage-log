import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { Group, Pagination, ScrollArea, Select, Skeleton, Table, Text } from '@mantine/core';

import { createColumns } from './columns';
import type { Vehicle } from '../../types';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/app/routes';

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

type Props = {
  data: Vehicle[];
  totalItems: number;
  totalPages: number;
  pagination: PaginationState;
  sorting: SortingState;
  setPagination: OnChangeFn<PaginationState>;
  setSorting: OnChangeFn<SortingState>;
  isFetching: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
};

export function VehiclesTable({
  data,
  totalItems,
  totalPages,
  pagination,
  sorting,
  setPagination,
  setSorting,
  isFetching,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

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

  const skeletonRows = useMemo(
    () =>
      Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
        <Table.Tr key={`skeleton-${rowIndex}`}>
          {columns.map((_, colIndex) => (
            <Table.Td key={`skeleton-${rowIndex}-${colIndex}`}>
              <Skeleton height={18} radius="sm" />
            </Table.Td>
          ))}
        </Table.Tr>
      )),
    [pagination.pageSize, columns],
  );

  return (
    <>
      <ScrollArea>
        <Table striped highlightOnHover>
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
            {isFetching ? (
              skeletonRows
            ) : table.getRowModel().rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length}>
                  <Text ta="center" c="dimmed">
                    No vehicles found
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  onClick={() => navigate(routes.vehicles.detail.build(row.original.id))}
                  style={{ cursor: 'pointer' }}
                >
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

      <Group justify="space-between" mt="md" align="center">
        <Group gap="md">
          <Text size="sm" c="dimmed">
            {totalItems} vehicles
          </Text>

          <Select
            size="xs"
            w={80}
            value={String(pagination.pageSize)}
            data={PAGE_SIZE_OPTIONS}
            onChange={(value) => {
              if (!value) return;

              setPagination({
                pageIndex: 0,
                pageSize: Number(value),
              });
            }}
          />
        </Group>

        <Pagination
          value={pagination.pageIndex + 1}
          onChange={(page) =>
            setPagination((prev) => ({
              ...prev,
              pageIndex: page - 1,
            }))
          }
          total={Math.max(totalPages, 1)}
          siblings={1}
          boundaries={1}
          withEdges
          disabled={isFetching}
        />
      </Group>
    </>
  );
}
