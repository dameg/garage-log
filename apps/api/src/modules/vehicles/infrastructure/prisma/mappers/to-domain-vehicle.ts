import type { Vehicle as PrismaVehicle } from '@prisma/client';
import type { Vehicle } from '../../../domain/vehicle';

export function toDomainVehicle(row: PrismaVehicle): Vehicle {
  return {
    id: row.id,
    ownerId: row.ownerId,
    vin: row.vin,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    createdAt: row.createdAt,
  };
}
