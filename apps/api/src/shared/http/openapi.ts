import { z, type ZodType } from 'zod';

type JsonSchema = Record<string, unknown>;
type OpenApiDocument = Record<string, any>;

function sanitizeJsonSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeJsonSchema);
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as JsonSchema)
      .filter(([key]) => key !== '$schema' && key !== 'pattern')
      .map(([key, nestedValue]) => [key, sanitizeJsonSchema(nestedValue)]);

    return Object.fromEntries(entries);
  }

  return value;
}

export function toOpenApiSchema(schema: ZodType): JsonSchema {
  const jsonSchema = z.toJSONSchema(schema, {
    io: 'input',
    target: 'draft-7',
    unrepresentable: 'any',
  }) as JsonSchema;

  return sanitizeJsonSchema(jsonSchema) as JsonSchema;
}

export const registerUserExample = {
  email: 'john@example.com',
  password: 'secret123',
} as const;

export const loginUserExample = {
  email: 'john@example.com',
  password: 'secret123',
} as const;

export const createVehicleExample = {
  vin: 'WAUZZZ8V0JA000001',
  brand: 'Audi',
  model: 'A3',
  year: 2018,
  mileage: 84250,
} as const;

export const updateVehicleExample = {
  mileage: 90500,
  model: 'A3 Sportback',
} as const;

export const listVehiclesQueryExample = {
  search: 'Audi',
  yearFrom: 2015,
  yearTo: 2020,
  mileageTo: 120000,
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  direction: 'desc',
} as const;

export const vehicleIdParamExample = {
  id: 'c7f6df50-6ec8-4bb1-8c5d-2b5c55cdb7d0',
} as const;

export const userExample = {
  id: '8df4d5c0-cd82-4fc2-b5e1-62de0fe42fd6',
  email: 'john@example.com',
} as const;

export const vehicleExample = {
  id: 'c7f6df50-6ec8-4bb1-8c5d-2b5c55cdb7d0',
  ownerId: '8df4d5c0-cd82-4fc2-b5e1-62de0fe42fd6',
  vin: 'WAUZZZ8V0JA000001',
  brand: 'Audi',
  model: 'A3',
  year: 2018,
  mileage: 84250,
  createdAt: '2026-03-21T10:15:00.000Z',
} as const;

export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'User identifier' },
    email: { type: 'string', format: 'email', description: 'User email address' },
  },
  required: ['id', 'email'],
} as const;

export const authResponseSchema = {
  type: 'object',
  properties: {
    user: userResponseSchema,
  },
  required: ['user'],
} as const;

export const vehicleResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Vehicle identifier' },
    ownerId: { type: 'string', format: 'uuid', description: 'Owner user identifier' },
    vin: { type: 'string', description: 'Vehicle identification number' },
    brand: { type: 'string', description: 'Vehicle brand' },
    model: { type: 'string', description: 'Vehicle model' },
    year: { type: 'integer', description: 'Production year' },
    mileage: { type: 'integer', description: 'Mileage in kilometers' },
    createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
  },
  required: ['id', 'ownerId', 'vin', 'brand', 'model', 'year', 'mileage', 'createdAt'],
} as const;

export const paginatedVehiclesResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: vehicleResponseSchema,
    },
    total: { type: 'integer' },
    page: { type: 'integer' },
    limit: { type: 'integer' },
  },
  required: ['data', 'total', 'page', 'limit'],
} as const;

export const healthResponseSchema = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', description: 'API readiness flag' },
    redis: { type: 'string', description: 'Redis ping result' },
  },
  required: ['ok', 'redis'],
} as const;

export const validationErrorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Bad Request' },
    message: { type: 'string', example: 'Validation error' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['path', 'message'],
      },
    },
  },
  required: ['error', 'message', 'issues'],
} as const;

export const unauthorizedErrorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Unauthorized' },
    message: { type: 'string', example: 'Authentication required' },
  },
  required: ['error', 'message'],
} as const;

export const notFoundErrorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Not Found' },
    message: { type: 'string' },
  },
  required: ['error', 'message'],
} as const;

export const conflictErrorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Conflict' },
    message: { type: 'string' },
  },
  required: ['error', 'message'],
} as const;

export const internalServerErrorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string', example: 'Internal Server Error' },
  },
  required: ['error'],
} as const;

function setMediaTypeExample(
  operation: Record<string, any> | undefined,
  responseCode: string,
  example: unknown,
) {
  const mediaType = operation?.responses?.[responseCode]?.content?.['application/json'];

  if (mediaType) {
    mediaType.example = example;
  }
}

function setRequestBodyExample(operation: Record<string, any> | undefined, example: unknown) {
  const mediaType = operation?.requestBody?.content?.['application/json'];

  if (mediaType) {
    mediaType.example = example;
  }
}

function setParameterExample(
  operation: Record<string, any> | undefined,
  parameterName: string,
  example: unknown,
) {
  const parameter = operation?.parameters?.find(
    (entry: Record<string, any>) => entry.name === parameterName,
  );

  if (parameter) {
    parameter.example = example;
  }
}

export function enhanceOpenApiDocument<T extends OpenApiDocument>(document: T): T {
  const registerOperation = document.paths?.['/api/auth/register']?.post;
  const loginOperation = document.paths?.['/api/auth/login']?.post;
  const meOperation = document.paths?.['/api/auth/me']?.get;
  const createVehicleOperation = document.paths?.['/api/vehicles/']?.post;
  const listVehiclesOperation = document.paths?.['/api/vehicles/']?.get;
  const vehicleByIdGetOperation = document.paths?.['/api/vehicles/{id}']?.get;
  const vehicleByIdPatchOperation = document.paths?.['/api/vehicles/{id}']?.patch;

  setRequestBodyExample(registerOperation, registerUserExample);
  setMediaTypeExample(registerOperation, '201', { user: userExample });

  setRequestBodyExample(loginOperation, loginUserExample);
  setMediaTypeExample(loginOperation, '200', { user: userExample });

  setMediaTypeExample(meOperation, '200', { user: userExample });

  setRequestBodyExample(createVehicleOperation, createVehicleExample);
  setMediaTypeExample(createVehicleOperation, '201', vehicleExample);

  setParameterExample(listVehiclesOperation, 'search', listVehiclesQueryExample.search);
  setParameterExample(listVehiclesOperation, 'yearFrom', listVehiclesQueryExample.yearFrom);
  setParameterExample(listVehiclesOperation, 'yearTo', listVehiclesQueryExample.yearTo);
  setParameterExample(listVehiclesOperation, 'mileageTo', listVehiclesQueryExample.mileageTo);
  setParameterExample(listVehiclesOperation, 'page', listVehiclesQueryExample.page);
  setParameterExample(listVehiclesOperation, 'limit', listVehiclesQueryExample.limit);
  setParameterExample(listVehiclesOperation, 'sortBy', listVehiclesQueryExample.sortBy);
  setParameterExample(listVehiclesOperation, 'direction', listVehiclesQueryExample.direction);
  setMediaTypeExample(listVehiclesOperation, '200', {
    data: [vehicleExample],
    total: 1,
    page: 1,
    limit: 10,
  });

  setParameterExample(vehicleByIdGetOperation, 'id', vehicleIdParamExample.id);
  setMediaTypeExample(vehicleByIdGetOperation, '200', vehicleExample);

  setParameterExample(vehicleByIdPatchOperation, 'id', vehicleIdParamExample.id);
  setRequestBodyExample(vehicleByIdPatchOperation, updateVehicleExample);
  setMediaTypeExample(vehicleByIdPatchOperation, '200', {
    ...vehicleExample,
    ...updateVehicleExample,
  });

  return document;
}
