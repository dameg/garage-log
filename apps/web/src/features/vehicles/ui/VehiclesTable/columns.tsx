import type { ColumnDef } from '@tanstack/react-table';
import type { Vehicle } from '../../types';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Group } from '@mantine/core';

export function createColumns(): ColumnDef<Vehicle>[] {
  return [
    {
      accessorKey: 'vin',
      header: 'VIN',
      cell: (info) => info.getValue(),
      enableSorting: false,
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'model',
      header: 'Model',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'year',
      header: 'Year',
      cell: (info) => info.getValue(),
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
      enableSorting: false,
      enableColumnFilter: false,
      header: '',
      cell: () => {
        // const vehicle = row.original;

        return (
          <Group>
            <button>
              <IconPencil size={16} />
            </button>
            <button>
              <IconTrash size={16} />
            </button>
          </Group>
        );
      },
    },
  ];
}
