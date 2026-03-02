import type { Vehicle } from "./types";

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (response) => response.json(),
  );
  return res;
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  ).then((response) => response.json());
  return res;
}
