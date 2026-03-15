import type { ColumnDef } from '@tanstack/react-table';
import type { Vehicle } from '../../types';

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'name',
    header: 'VIN',
    cell: (info) => info.getValue(),
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
];
