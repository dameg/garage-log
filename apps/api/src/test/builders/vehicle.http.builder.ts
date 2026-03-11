import { CreateVehicleBody } from '../../modules/vehicles/presentation/validation/create-vehicle.schema';

export class VehicleHttpBuilder {
  private data: CreateVehicleBody = {
    name: 'E46',
    brand: 'BMW',
    model: '330i',
    year: 2002,
    mileage: 250000,
  };

  withName(name: string) {
    this.data.name = name;
    return this;
  }

  withBrand(brand: string) {
    this.data.brand = brand;
    return this;
  }

  withModel(model: string) {
    this.data.model = model;
    return this;
  }

  withYear(year: number) {
    this.data.year = year;
    return this;
  }

  withMileage(mileage: number) {
    this.data.mileage = mileage;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
