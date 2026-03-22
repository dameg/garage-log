import type { FastifyInstance } from 'fastify';
import { createVehicleHttpSchema } from '../validation/create-vehicle.schema';
import { createVehiclesServices } from '../../vehicles.factory';
import { vehicleIdParamsSchema } from '../validation/vehicle-id.schema';
import { updateVehicleHttpSchema } from '../validation/update-vehicle.schema';
import { listVehiclesQuerySchema } from '../validation/list-vehicles-query.schema';
import {
  createRateLimitOpenApiResponse,
  internalServerErrorResponseSchema,
  notFoundErrorResponseSchema,
  paginatedVehiclesResponseSchema,
  toOpenApiSchema,
  unauthorizedErrorResponseSchema,
  validationErrorResponseSchema,
  vehicleResponseSchema,
  vehiclesRateLimitDescription,
} from '../../../../shared/http/openapi';

export async function vehiclesRoutes(app: FastifyInstance) {
  const {
    createVehicleUseCase,
    listVehiclesUseCase,
    getVehicleUseCase,
    deleteVehicleUseCase,
    updateVehicleUseCase,
  } = createVehiclesServices(app);

  app.post(
    '/',
    {
      schema: {
        tags: ['Vehicles'],
        operationId: 'createVehicle',
        summary: 'Create vehicle',
        description:
          'Creates a vehicle for the authenticated user. ' + vehiclesRateLimitDescription,
        security: [{ cookieAuth: [] }],
        body: toOpenApiSchema(createVehicleHttpSchema),
        response: {
          201: {
            description: 'Vehicle created successfully',
            ...vehicleResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse(),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const body = createVehicleHttpSchema.parse(req.body);

      const created = await createVehicleUseCase.execute({ ...body, ownerId: req.user.sub });

      return reply.code(201).send(created);
    },
  );

  app.get(
    '/',
    {
      schema: {
        tags: ['Vehicles'],
        operationId: 'listVehicles',
        summary: 'List vehicles',
        description:
          'Returns a paginated list of vehicles for the authenticated user. Supports text search, numeric ranges, sorting and pagination. ' +
          vehiclesRateLimitDescription,
        security: [{ cookieAuth: [] }],
        querystring: toOpenApiSchema(listVehiclesQuerySchema),
        response: {
          200: {
            description: 'Paginated list of vehicles',
            ...paginatedVehiclesResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse(),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req) => {
      const query = listVehiclesQuerySchema.parse(req.query);

      return listVehiclesUseCase.execute({ ...query, ownerId: req.user.sub });
    },
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['Vehicles'],
        operationId: 'getVehicle',
        summary: 'Get vehicle',
        description:
          'Returns a single vehicle by id for the authenticated user. ' +
          vehiclesRateLimitDescription,
        security: [{ cookieAuth: [] }],
        params: toOpenApiSchema(vehicleIdParamsSchema),
        response: {
          200: {
            description: 'Vehicle details',
            ...vehicleResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          404: {
            description: 'Vehicle not found',
            ...notFoundErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse(),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req) => {
      const params = vehicleIdParamsSchema.parse(req.params);

      return getVehicleUseCase.execute({ ...params, ownerId: req.user.sub });
    },
  );

  app.delete(
    '/:id',
    {
      schema: {
        tags: ['Vehicles'],
        operationId: 'deleteVehicle',
        summary: 'Delete vehicle',
        description:
          'Deletes a vehicle by id for the authenticated user. ' + vehiclesRateLimitDescription,
        security: [{ cookieAuth: [] }],
        params: toOpenApiSchema(vehicleIdParamsSchema),
        response: {
          204: {
            description: 'Vehicle deleted successfully',
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          404: {
            description: 'Vehicle not found',
            ...notFoundErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse(),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const params = vehicleIdParamsSchema.parse(req.params);

      await deleteVehicleUseCase.execute({ ...params, ownerId: req.user.sub });

      return reply.code(204).send();
    },
  );

  app.patch(
    '/:id',
    {
      schema: {
        tags: ['Vehicles'],
        operationId: 'updateVehicle',
        summary: 'Update vehicle',
        description:
          'Updates selected fields for a vehicle owned by the authenticated user. ' +
          vehiclesRateLimitDescription,
        security: [{ cookieAuth: [] }],
        params: toOpenApiSchema(vehicleIdParamsSchema),
        body: toOpenApiSchema(updateVehicleHttpSchema),
        response: {
          200: {
            description: 'Vehicle updated successfully',
            ...vehicleResponseSchema,
          },
          400: {
            description: 'Validation error',
            ...validationErrorResponseSchema,
          },
          401: {
            description: 'Unauthorized',
            ...unauthorizedErrorResponseSchema,
          },
          404: {
            description: 'Vehicle not found',
            ...notFoundErrorResponseSchema,
          },
          429: createRateLimitOpenApiResponse(),
          500: {
            description: 'Unexpected error',
            ...internalServerErrorResponseSchema,
          },
        },
      },
    },
    async (req, reply) => {
      const params = vehicleIdParamsSchema.parse(req.params);

      const body = updateVehicleHttpSchema.parse(req.body);

      const updated = await updateVehicleUseCase.execute({
        id: params.id,
        ownerId: req.user.sub,
        patch: body,
      });

      return reply.code(200).send(updated);
    },
  );
}
