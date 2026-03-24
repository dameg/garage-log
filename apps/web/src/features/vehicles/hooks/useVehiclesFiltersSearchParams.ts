import { useSearchParams } from 'react-router-dom';
import type { VehicleFilters } from '../types';

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

  const setFilters = ({ search, yearFrom, yearTo, mileageFrom, mileageTo }: VehicleFilters) => {
    const nextParams = new URLSearchParams(searchParams);

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

    const current = searchParams.toString();
    const next = nextParams.toString();

    if (current === next) return;

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
    setFilters,
    resetFilters,
  };
}
