import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (response) => response.json(),
  );
  throw new Error("Failed to fetch products");
  return res;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  ).then((response) => response.json());
  return res;
}
