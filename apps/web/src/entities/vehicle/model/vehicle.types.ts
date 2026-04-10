export type Vehicle = {
  id: string;
  ownerId: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: string;
};

export type VehiclesSortBy = 'createdAt' | 'vin' | 'brand' | 'model' | 'year' | 'mileage';

export type VehicleResponse = Vehicle;
