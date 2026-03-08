import type { UpdatableVehicleFields, Vehicle } from '../../domain/vehicle';
import type { VehicleRepository } from '../../domain/vehicle.repository';
import type { PrismaClient } from '@prisma/client';

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const created = await this.prisma.vehicle.create({
      data: {
        id: vehicle.id,
        ownerId: vehicle.ownerId,
        name: vehicle.name,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        createdAt: vehicle.createdAt,
      },
    });

    return created;
  }

  async findAllByOwnerId(ownerId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({
      where: { id, ownerId },
    });
  }

  async deleteByIdForOwner(id: string, ownerId: string): Promise<boolean> {
    const result = await this.prisma.vehicle.deleteMany({
      where: { id, ownerId },
    });

    return result.count > 0;
  }

  async updateByIdForOwner(
    id: string,
    ownerId: string,
    data: UpdatableVehicleFields,
  ): Promise<Vehicle | null> {
    const result = await this.prisma.vehicle.updateMany({
      where: { id, ownerId },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.vehicle.findFirst({
      where: { id, ownerId },
    });
  }
}
