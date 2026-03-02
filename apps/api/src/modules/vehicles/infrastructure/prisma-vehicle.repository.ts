import type { Vehicle } from "../domain/vehicle";
import type { VehicleRepository } from "../domain/vehicle.repository";
import { PrismaService } from "../../../shared/db/prisma.service";

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private prisma: PrismaService) {}

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
      orderBy: { createdAt: "desc" },
    });
  }
}
