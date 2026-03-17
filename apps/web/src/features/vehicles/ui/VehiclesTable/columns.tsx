import { ActionIcon, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Vehicle } from '../../types';

type Props = {
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
};

export function createColumns({ onEdit, onDelete }: Props = {}): ColumnDef<Vehicle>[] {
  return [
    {
      accessorKey: 'vin',
      header: 'VIN',
      enableSorting: false,
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'mileage',
      header: 'Mileage',
      cell: (info) => Number(info.getValue()).toLocaleString(),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(row.original);
            }}
          >
            <IconEdit size={16} />
          </ActionIcon>

          <ActionIcon
            variant="subtle"
            color="red"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.(row.original);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];
}
