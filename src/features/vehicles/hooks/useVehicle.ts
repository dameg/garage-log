import { useQuery } from "@tanstack/react-query";
import { vehiclesQueries } from "../queries/vehicles.queries";

export const useVehicle = (id: string) => {
  return useQuery({ ...vehiclesQueries.detail(id), enabled: !!id });
};
