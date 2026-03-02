import { useVehicle } from "../hooks";
import { useRequiredParam } from "@/shared/lib/router";

export function Detail() {
  const id = useRequiredParam("id");

  const { data, isLoading, isError, error } = useVehicle(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{String(error)}</div>;

  return <div>Detail for {data?.id}</div>;
}
