import { CreateVehicleUseCase } from './application/create-vehicle.usecase';
import { DeleteVehicleUseCase } from './application/delete-vehicle.usecase';
import { GetVehicleUseCase } from './application/get-vehicle.usecase';
import { ListVehiclesUseCase } from './application/list-vehicles.usecase';
import { UpdateVehicleUseCase } from './application/update-vehicle.usecase';
import type { VehicleRepository } from './contracts/vehicle.repository';

type VehicleDeps = {
  repository: VehicleRepository;
};

export function createVehicleServices({ repository }: VehicleDeps) {
  return {
    createVehicleUseCase: new CreateVehicleUseCase(repository),
    listVehiclesUseCase: new ListVehiclesUseCase(repository),
    getVehicleUseCase: new GetVehicleUseCase(repository),
    deleteVehicleUseCase: new DeleteVehicleUseCase(repository),
    updateVehicleUseCase: new UpdateVehicleUseCase(repository),
  };
}
