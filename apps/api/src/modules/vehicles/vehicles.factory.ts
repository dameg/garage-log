import type { FastifyInstance } from 'fastify';
import { CreateVehicleUseCase } from './application/create-vehicle.usecase';
import { ListVehiclesUseCase } from './application/list-vehicles.usecase';
import { GetVehicleUseCase } from './application/get-vehicle.usecase';
import { DeleteVehicleUseCase } from './application/delete-vehicle.usecase';
import { UpdateVehicleUseCase } from './application/update-vehicle.usecase';

export function createVehiclesServices(app: FastifyInstance) {
  return {
    createVehicleUseCase: new CreateVehicleUseCase(app.deps.vehiclesRepo),
    listVehiclesUseCase: new ListVehiclesUseCase(app.deps.vehiclesRepo),
    getVehicleUseCase: new GetVehicleUseCase(app.deps.vehiclesRepo),
    deleteVehicleUseCase: new DeleteVehicleUseCase(app.deps.vehiclesRepo),
    updateVehicleUseCase: new UpdateVehicleUseCase(app.deps.vehiclesRepo),
  };
}
