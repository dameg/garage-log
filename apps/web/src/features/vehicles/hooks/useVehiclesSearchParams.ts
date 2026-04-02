import type { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortDirection } from '@/shared/types/sorting';
import type { VehicleFilters, VehiclesListParams, VehiclesSortBy } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_BY: VehiclesSortBy = 'createdAt';
const DEFAULT_DIRECTION: SortDirection = 'desc';
const EMPTY = '';

function toPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toOptionalNumber(value: string | null) {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveUpdater<T>(updater: T | ((previous: T) => T), previous: T) {
  return typeof updater === 'function'
    ? (updater as (previous: T) => T)(previous)
    : updater;
}

export function useVehiclesSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination = useMemo<PaginationState>(() => {
    const page = toPositiveNumber(searchParams.get('page'), DEFAULT_PAGE);
    const limit = toPositiveNumber(searchParams.get('limit'), DEFAULT_LIMIT);

    return {
      pageIndex: Math.max(page - 1, 0),
      pageSize: limit,
    };
  }, [searchParams]);

  const sorting = useMemo<SortingState>(() => {
    const sortBy = (searchParams.get('sortBy') as VehiclesSortBy | null) ?? DEFAULT_SORT_BY;
    const direction = (searchParams.get('direction') as SortDirection | null) ?? DEFAULT_DIRECTION;

    return [
      {
        id: sortBy,
        desc: direction === 'desc',
      },
    ];
  }, [searchParams]);

  const filters = useMemo<VehicleFilters>(
    () => ({
      search: searchParams.get('search') ?? EMPTY,
      yearFrom: toOptionalNumber(searchParams.get('yearFrom')),
      yearTo: toOptionalNumber(searchParams.get('yearTo')),
      mileageFrom: toOptionalNumber(searchParams.get('mileageFrom')),
      mileageTo: toOptionalNumber(searchParams.get('mileageTo')),
    }),
    [searchParams],
  );

  const updateSearchParams = (recipe: (next: URLSearchParams) => void) => {
    const nextParams = new URLSearchParams(searchParams);
    recipe(nextParams);

    if (nextParams.toString() === searchParams.toString()) return;

    setSearchParams(nextParams, { replace: true });
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const nextPagination = resolveUpdater(updater, pagination);

    updateSearchParams((nextParams) => {
      nextParams.set('page', String(nextPagination.pageIndex + 1));
      nextParams.set('limit', String(nextPagination.pageSize));
    });
  };

  const setSorting: OnChangeFn<SortingState> = (updater) => {
    const nextSorting = resolveUpdater(updater, sorting);
    const sort = nextSorting[0];

    updateSearchParams((nextParams) => {
      nextParams.set('sortBy', (sort?.id as VehiclesSortBy | undefined) ?? DEFAULT_SORT_BY);
      nextParams.set('direction', sort?.desc ? 'desc' : 'asc');
      nextParams.set('page', '1');
    });
  };

  const setFilters = ({ search, yearFrom, yearTo, mileageFrom, mileageTo }: VehicleFilters) => {
    updateSearchParams((nextParams) => {
      if (search != null) nextParams.set('search', search);
      else nextParams.delete('search');

      if (yearFrom != null) nextParams.set('yearFrom', String(yearFrom));
      else nextParams.delete('yearFrom');

      if (yearTo != null) nextParams.set('yearTo', String(yearTo));
      else nextParams.delete('yearTo');

      if (mileageFrom != null) nextParams.set('mileageFrom', String(mileageFrom));
      else nextParams.delete('mileageFrom');

      if (mileageTo != null) nextParams.set('mileageTo', String(mileageTo));
      else nextParams.delete('mileageTo');

      nextParams.set('page', '1');
    });
  };

  const resetFilters = () => {
    updateSearchParams((nextParams) => {
      nextParams.delete('search');
      nextParams.delete('yearFrom');
      nextParams.delete('yearTo');
      nextParams.delete('mileageFrom');
      nextParams.delete('mileageTo');
      nextParams.set('page', '1');
    });
  };

  const params = useMemo<VehiclesListParams>(
    () => ({
      ...filters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: (sorting[0]?.id as VehiclesSortBy | undefined) ?? DEFAULT_SORT_BY,
      direction: sorting[0]?.desc ? 'desc' : 'asc',
    }),
    [filters, pagination.pageIndex, pagination.pageSize, sorting],
  );

  return {
    params,
    filters,
    pagination,
    sorting,
    setFilters,
    resetFilters,
    setPagination,
    setSorting,
  };
}
