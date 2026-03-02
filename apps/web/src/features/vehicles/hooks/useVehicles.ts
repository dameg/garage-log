import { useQuery } from "@tanstack/react-query";
import { vehiclesQueries } from "../queries/vehicles.queries";

export const useVehicles = () => {
  return useQuery(vehiclesQueries.list());
};
