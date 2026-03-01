import { useQuery } from "@tanstack/react-query";
import { productsQueries } from "../queries/products.queries";

export const useProducts = () => {
  return useQuery(productsQueries.list());
};

export const useProduct = (id: string) => {
  return useQuery(productsQueries.detail(id));
};
