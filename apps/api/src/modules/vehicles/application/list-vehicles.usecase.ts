import { VehicleListQuery } from '../contracts/vehicle-list.query';
import { VehicleRepository } from '../contracts/vehicle.repository';
import type { ListVehiclesInput } from './dto/list-vehicles.dto';

export class ListVehiclesUseCase {
  constructor(private readonly repo: VehicleRepository) {}

  async execute(input: ListVehiclesInput) {
    const query: VehicleListQuery = {
      ownerId: input.ownerId,
      filters: {
        search: input.search,
        mileageFrom: input.mileageFrom,
        mileageTo: input.mileageTo,
        yearFrom: input.yearFrom,
        yearTo: input.yearTo,
      },
      sort: {
        field: input.sortBy,
        direction: input.direction,
      },
      page: input.page,
      limit: input.limit,
    };

    return this.repo.list(query);
  }
}
