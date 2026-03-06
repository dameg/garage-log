import { createVehicleHttpSchema } from './create-vehicle.schema';

export const updateVehicleHttpSchema = createVehicleHttpSchema.partial();
