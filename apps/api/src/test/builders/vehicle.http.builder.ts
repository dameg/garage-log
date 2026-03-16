import { CreateVehicleBody } from '../../modules/vehicles/presentation/validation/create-vehicle.schema';

export class VehicleHttpBuilder {
  private data: CreateVehicleBody = {
    vin: '7PB4MVCXD3PR45211',
    brand: 'BMW',
    model: '330i',
    year: 2002,
    mileage: 250000,
  };

  withVin(vin: string) {
    this.data.vin = vin;
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
