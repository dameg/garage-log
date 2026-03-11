import { normalizeRequiredString } from '../../../shared/domain/normalize-required-string';
import { DomainError } from '../../../shared/errors/domain-error';

export type VehicleId = string;

export type Vehicle = {
  id: VehicleId;
  ownerId: string;
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
  const name = normalizeRequiredString('Vehicle name', props.name);
  const brand = normalizeRequiredString('Vehicle brand', props.brand);
  const model = normalizeRequiredString('Vehicle model', props.model);

  assertYear(props.year);
  assertMileage(props.mileage);

  if (!props.ownerId) {
    throw new DomainError('Vehicle ownerId is required');
  }

  return {
    id: props.id,
    ownerId: props.ownerId,
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
    next.name = normalizeRequiredString('Vehicle name', patch.name);
  }

  if (patch.brand !== undefined) {
    next.brand = normalizeRequiredString('Vehicle brand', patch.brand);
  }

  if (patch.model !== undefined) {
    next.model = normalizeRequiredString('Vehicle model', patch.model);
  }

  assertYear(next.year);
  assertMileage(next.mileage);

  return next;
}
