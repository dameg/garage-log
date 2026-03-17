import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortDirection } from '@/shared/types/sorting';
import type { VehiclesListParams, VehiclesSortBy } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_BY: VehiclesSortBy = 'createdAt';
const DEFAULT_DIRECTION: SortDirection = 'desc';

export const useVehiclesTableSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const initialLimit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);

  const initialSortBy = (searchParams.get('sortBy') as VehiclesSortBy | null) ?? DEFAULT_SORT_BY;

  const initialDirection =
    (searchParams.get('direction') as SortDirection | null) ?? DEFAULT_DIRECTION;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Math.max(initialPage - 1, 0),
    pageSize: initialLimit,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: initialSortBy,
      desc: initialDirection === 'desc',
    },
  ]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set('page', String(pagination.pageIndex + 1));
    nextParams.set('limit', String(pagination.pageSize));

    const sort = sorting[0];

    nextParams.set('sortBy', (sort?.id as VehiclesSortBy | undefined) ?? DEFAULT_SORT_BY);
    nextParams.set('direction', sort?.desc ? 'desc' : 'asc');

    setSearchParams(nextParams, { replace: true });
  }, [pagination, sorting, setSearchParams, searchParams]);

  const params: VehiclesListParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: (sorting[0]?.id as VehiclesSortBy | undefined) ?? DEFAULT_SORT_BY,
    direction: sorting[0]?.desc ? 'desc' : 'asc',
  };

  return {
    params,
    pagination,
    sorting,
    setPagination,
    setSorting,
  };
};
