import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import {
  VEHICLE_REPOSITORY,
  type VehicleRepository,
} from "../domain/vehicle.repository";
import { CreateVehicleUseCase } from "../application/create-vehicle.usecase";
import { ListVehiclesUseCase } from "../application/list-vehicles.usecase";
import { CreateVehicleRequest } from "./dto/create-vehicle.request";

@Controller("vehicles")
export class VehiclesController {
  private createUC: CreateVehicleUseCase;
  private listUC: ListVehiclesUseCase;

  constructor(@Inject(VEHICLE_REPOSITORY) repo: VehicleRepository) {
    this.createUC = new CreateVehicleUseCase(repo);
    this.listUC = new ListVehiclesUseCase(repo);
  }

  @Post()
  create(@Body() body: CreateVehicleRequest) {
    return this.createUC.execute(body);
  }

  @Get()
  list() {
    return this.listUC.execute();
  }
}
