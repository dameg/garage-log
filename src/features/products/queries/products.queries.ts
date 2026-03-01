import { queryOptions } from "@tanstack/react-query";
import { getProducts, getProduct } from "../api";
import { productsKeys } from "./products.keys";

export const productsQueries = {
  list: () =>
    queryOptions({
      queryKey: productsKeys.list(),
      queryFn: getProducts,
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: true,
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: productsKeys.detail(id),
      queryFn: () => getProduct(id),
      staleTime: 0,
      retry: 3,
    }),
};
