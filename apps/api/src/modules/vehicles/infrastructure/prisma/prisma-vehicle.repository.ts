import { PaginatedResult } from '../../domain/paginated-result';
import type { UpdatableVehicleFields, Vehicle } from '../../domain/vehicle';
import { VehicleListQuery } from '../../domain/vehicle-list.query';
import type { VehicleRepository } from '../../domain/vehicle.repository';
import type { PrismaClient } from '@prisma/client';
import { buildVehicleWhere } from './build-vehicle-where';
import { toDomainVehicle } from './mappers/to-domain-vehicle';

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

    return toDomainVehicle(created);
  }

  async findManyByOwner(query: VehicleListQuery): Promise<PaginatedResult<Vehicle>> {
    const where = buildVehicleWhere(query);
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [rows, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        skip,
        take,
        orderBy: {
          [query.sort.field]: query.sort.direction,
        },
      }),
      this.prisma.vehicle.count({
        where,
      }),
    ]);

    return {
      data: rows.map(toDomainVehicle),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findByIdForOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    const row = await this.prisma.vehicle.findFirst({
      where: { id, ownerId },
    });

    return row ? toDomainVehicle(row) : null;
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

    const row = await this.prisma.vehicle.findFirst({
      where: { id, ownerId },
    });

    return row ? toDomainVehicle(row) : null;
  }
}
