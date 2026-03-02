export type VehicleId = string;

export type Vehicle = {
  id: VehicleId;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: Date;
};

export function createVehicle(input: {
  id: VehicleId;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const name = input.name.trim();
  const brand = input.brand.trim();
  const model = input.model.trim();

  if (!name) throw new Error("Vehicle name cannot be empty");
  if (!brand) throw new Error("Vehicle brand cannot be empty");
  if (!model) throw new Error("Vehicle model cannot be empty");

  if (input.year < 1886) throw new Error("Invalid year");
  if (input.mileage < 0) throw new Error("Invalid mileage");

  return {
    id: input.id,
    name,
    brand,
    model,
    year: input.year,
    mileage: input.mileage,
    createdAt: now,
  };
}
