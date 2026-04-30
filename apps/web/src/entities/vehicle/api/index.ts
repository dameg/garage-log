export {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from './vehicle.api';
export type {
  CreateVehicleInput,
  UpdateVehicleInput,
  UpdateVehiclePayload,
  VehiclesListParams,
} from './vehicle.contracts';
export { getVehicleDocuments } from './vehicle-document.api';
export type {
  CreateVehicleDocumentInput,
  UpdateVehicleDocumentPayload,
  VehicleDocumentListCursor,
  VehicleDocumentListParams,
  VehicleDocumentListResponse,
} from './vehicle-document.contracts';
