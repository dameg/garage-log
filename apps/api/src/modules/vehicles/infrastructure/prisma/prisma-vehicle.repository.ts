import type { UpdatableVehicleFields, Vehicle } from '../../domain/vehicle';
import type { VehicleRepository } from '../../domain/vehicle.repository';
import type { PrismaClient } from '@prisma/client';

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const created = await this.prisma.vehicle.create({
      data: {
        id: vehicle.id,
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

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.vehicle.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }

  async updateById(id: string, data: UpdatableVehicleFields): Promise<Vehicle | null> {
    const result = await this.prisma.vehicle.updateMany({
      where: { id },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }
}
