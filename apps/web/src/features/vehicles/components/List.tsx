import { useVehicles } from "../hooks/useVehicles";
import { ListCard } from "./ListCard";

export function List() {
  const { data, isLoading, isError, error } = useVehicles();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>{String(error)}</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((product) => (
        <ListCard key={product.id} vehicle={product} />
      ))}
    </div>
  );
}
