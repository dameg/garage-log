import { useEffect, useRef, useState } from 'react';

const SEARCH_DEBOUNCE_MS = 300;

export function useVehiclesTextSearch(
  initialValue: string,
  setSearchInUrl: (value: string) => void,
) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setSearchInput(initialValue);
  }, [initialValue]);

  const onSearchChange = (value: string) => {
    setSearchInput(value);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setSearchInUrl(value);
      timeoutRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  };

  const resetSearch = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setSearchInput('');
  };

  return {
    searchInput,
    onSearchChange,
    resetSearch,
  };
}
