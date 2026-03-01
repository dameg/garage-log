import { useVehicles } from "../hooks/useVehicles";
import { ListCard } from "./ListCard";

export function List() {
  const { data, isLoading, isError, error } = useVehicles();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>{String(error)}</div>;
  return (
    <ul className="space-y-4">
      {data?.map((product) => (
        <ListCard key={product.id} vehicle={product} />
      ))}
    </ul>
  );
}
