import { useParams } from "react-router-dom";
import { useVehicle } from "../hooks";

export function Detail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useVehicle(id ?? "");

  if (!id) return <div>Invalid route</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{String(error)}</div>;

  return <div>Detail for {data?.id}</div>;
}
