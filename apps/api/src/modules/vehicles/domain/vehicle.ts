import { normalizeRequiredString } from '../../../shared/domain/normalize-required-string';
import { DomainError } from '../../../shared/errors/domain-error';

export type VehicleId = string;

export type Vehicle = {
  id: VehicleId;
  ownerId: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  createdAt: Date;
};

export type CreateVehicleProps = Omit<Vehicle, 'createdAt'> & {
  createdAt?: Date;
};

export type UpdatableVehicleFields = Pick<Vehicle, 'vin' | 'brand' | 'model' | 'year' | 'mileage'>;

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
  const vin = normalizeRequiredString('Vehicle vin', props.vin);
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
    vin,
    brand,
    model,
    year: props.year,
    mileage: props.mileage,
    createdAt: props.createdAt ?? new Date(),
  };
}

export function updateVehicle(vehicle: Vehicle, patch: UpdateVehiclePatch): Vehicle {
  const next: Vehicle = { ...vehicle, ...patch };

  if (patch.vin !== undefined) {
    next.vin = normalizeRequiredString('Vehicle vin', patch.vin);
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
