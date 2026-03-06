import { DomainError } from '../../../shared/errors/domain-error';

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

export type CreateVehicleProps = Omit<Vehicle, 'createdAt'> & {
  createdAt?: Date;
};

export type UpdatableVehicleFields = Pick<Vehicle, 'name' | 'brand' | 'model' | 'year' | 'mileage'>;

export type UpdateVehiclePatch = Partial<UpdatableVehicleFields>;

function normalizeString(label: string, value: string): string {
  const v = value.trim();

  if (!v) {
    throw new DomainError(`${label} cannot be empty`);
  }

  return v;
}

function assertYear(year: number) {
  if (!Number.isInteger(year) || year < 1886) {
    throw new DomainError('Invalid year');
  }
}

function assertMileage(mileage: number) {
  if (!Number.isInteger(mileage) || mileage < 0) {
    throw new DomainError('Invalid mileage');
  }
}

export function createVehicle(props: CreateVehicleProps): Vehicle {
  const name = normalizeString('Vehicle name', props.name);
  const brand = normalizeString('Vehicle brand', props.brand);
  const model = normalizeString('Vehicle model', props.model);

  assertYear(props.year);
  assertMileage(props.mileage);

  return {
    id: props.id,
    name,
    brand,
    model,
    year: props.year,
    mileage: props.mileage,
    createdAt: props.createdAt ?? new Date(),
  };
}

export function updateVehicle(vehicle: Vehicle, patch: UpdateVehiclePatch): Vehicle {
  const next: Vehicle = { ...vehicle, ...patch };

  if (patch.name !== undefined) {
    next.name = normalizeString('Vehicle name', patch.name);
  }

  if (patch.brand !== undefined) {
    next.brand = normalizeString('Vehicle brand', patch.brand);
  }

  if (patch.model !== undefined) {
    next.model = normalizeString('Vehicle model', patch.model);
  }

  assertYear(next.year);
  assertMileage(next.mileage);

  return next;
}
