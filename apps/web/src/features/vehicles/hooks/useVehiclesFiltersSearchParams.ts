import { useSearchParams } from 'react-router-dom';

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

  const setYearFrom = (value?: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value != null) {
      nextParams.set('yearFrom', String(value));
    } else {
      nextParams.delete('yearFrom');
    }

    nextParams.set('page', '1');

    setSearchParams(nextParams, { replace: true });
  };

  const setYearTo = (value?: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value != null) {
      nextParams.set('yearTo', String(value));
    } else {
      nextParams.delete('yearTo');
    }

    nextParams.set('page', '1');

    setSearchParams(nextParams, { replace: true });
  };

  const setMileageFrom = (value?: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value != null) {
      nextParams.set('mileageFrom', String(value));
    } else {
      nextParams.delete('mileageFrom');
    }

    nextParams.set('page', '1');

    setSearchParams(nextParams, { replace: true });
  };

  const setMileageTo = (value?: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value != null) {
      nextParams.set('mileageTo', String(value));
    } else {
      nextParams.delete('mileageTo');
    }

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
    setYearFrom,
    setYearTo,
    setMileageFrom,
    setMileageTo,
    resetFilters,
  };
}
