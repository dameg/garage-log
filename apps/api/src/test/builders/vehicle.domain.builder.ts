import { randomUUID } from 'crypto';
import { CreateVehicleProps } from '../../modules/vehicles/domain/vehicle';

export class VehicleDomainBuilder {
  private data: CreateVehicleProps = {
    id: randomUUID(),
    ownerId: randomUUID(),
    name: 'E46',
    brand: 'BMW',
    model: '330i',
    year: 2002,
    mileage: 250000,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  withId(id: string) {
    this.data.id = id;
    return this;
  }

  withOwnerId(ownerId: string) {
    this.data.ownerId = ownerId;
    return this;
  }

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

  withCreatedAt(createdAt: Date) {
    this.data.createdAt = createdAt;
    return this;
  }

  build() {
    return { ...this.data };
  }
}
