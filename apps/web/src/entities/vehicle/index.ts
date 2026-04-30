export type {
  CreateVehicleDocumentInput,
  CreateVehicleInput,
  UpdateVehicleDocumentPayload,
  UpdateVehicleInput,
  UpdateVehiclePayload,
  VehicleDocumentListCursor,
  VehicleDocumentListParams,
  VehicleDocumentListResponse,
  VehiclesListParams,
} from './api';
export {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicleDocuments,
  getVehicles,
  updateVehicle,
} from './api';
export { getVehicleDocumentTypeLabel } from './lib';
export type {
  Vehicle,
  VehicleDocument,
  VehicleDocumentResponse,
  VehicleDocumentType,
  VehicleResponse,
  VehiclesSortBy,
} from './model';
export {
  useVehicle,
  useVehicleDocuments,
  vehicleDocumentKeys,
  vehicleDocumentQueries,
  vehicleKeys,
  vehicleMutations,
  vehicleQueries,
} from './model';
export { getVehicleDocumentTypeIcon } from './ui';
