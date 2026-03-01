import { useProducts } from "../hooks/useProducts";
import ListItem from "./ListItem";

export function List() {
  const { data, isLoading, isError, error } = useProducts();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>{String(error)}</div>;
  return (
    <ul>
      {isLoading && <li>Loading...</li>}
      {data?.map((product) => (
        <ListItem key={product.id} product={product} />
      ))}
    </ul>
  );
}
