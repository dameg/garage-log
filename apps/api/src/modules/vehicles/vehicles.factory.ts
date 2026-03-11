import { FastifyInstance } from 'fastify';
import { CreateVehicleUseCase } from './application/create-vehicle.usecase';
import { ListVehicleUseCase } from './application/list-vehicle.usecase';
import { GetVehicleUseCase } from './application/get-vehicle.usecase';
import { DeleteVehicleUseCase } from './application/delete-vehicle.usecase';
import { UpdateVehicleUseCase } from './application/update-vehicle.usecase';

export function createVehiclesServices(app: FastifyInstance) {
  return {
    createVehicleUseCase: new CreateVehicleUseCase(app.deps.vehiclesRepo),
    listVehicleUseCase: new ListVehicleUseCase(app.deps.vehiclesRepo),
    getVehicleUseCase: new GetVehicleUseCase(app.deps.vehiclesRepo),
    deleteVehicleUseCase: new DeleteVehicleUseCase(app.deps.vehiclesRepo),
    updateVehicleUseCase: new UpdateVehicleUseCase(app.deps.vehiclesRepo),
  };
}
