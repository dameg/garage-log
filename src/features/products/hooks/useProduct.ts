import { useQuery } from "@tanstack/react-query";
import { productsQueries } from "../queries/products.queries";

export const useProduct = (id: string) => {
  return useQuery({ ...productsQueries.detail(id), enabled: Boolean(id) });
};
