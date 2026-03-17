import { useSearchParams } from 'react-router-dom';
import type { VehicleRangeFilters } from '../types';

const EMPTY = '';

export function useVehiclesFiltersSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? EMPTY;

  const yearFrom = searchParams.get('yearFrom') ? Number(searchParams.get('yearFrom')) : undefined;

  const yearTo = searchParams.get('yearTo') ? Number(searchParams.get('yearTo')) : undefined;

  const mileageFrom = searchParams.get('mileageFrom')
    ? Number(searchParams.get('mileageFrom'))
    : undefined;

  const mileageTo = searchParams.get('mileageTo')
    ? Number(searchParams.get('mileageTo'))
    : undefined;

  const setSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set('search', value);
    } else {
      nextParams.delete('search');
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  const setRangeFilters = ({ yearFrom, yearTo, mileageFrom, mileageTo }: VehicleRangeFilters) => {
    const nextParams = new URLSearchParams(searchParams);

    if (yearFrom != null) nextParams.set('yearFrom', String(yearFrom));
    else nextParams.delete('yearFrom');

    if (yearTo != null) nextParams.set('yearTo', String(yearTo));
    else nextParams.delete('yearTo');

    if (mileageFrom != null) nextParams.set('mileageFrom', String(mileageFrom));
    else nextParams.delete('mileageFrom');

    if (mileageTo != null) nextParams.set('mileageTo', String(mileageTo));
    else nextParams.delete('mileageTo');

    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  };

  const resetFilters = () => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete('search');
    nextParams.delete('yearFrom');
    nextParams.delete('yearTo');
    nextParams.delete('mileageFrom');
    nextParams.delete('mileageTo');
    nextParams.set('page', '1');

    setSearchParams(nextParams, { replace: true });
  };

  return {
    filters: {
      search,
      yearFrom,
      yearTo,
      mileageFrom,
      mileageTo,
    },
    setSearch,
    setRangeFilters,
    resetFilters,
  };
}
