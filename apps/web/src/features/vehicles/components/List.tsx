import { useVehicles } from '../hooks/useVehicles';

export function List() {
  const { isLoading, isError, error } = useVehicles();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>{String(error)}</div>;
  return <></>;
}
