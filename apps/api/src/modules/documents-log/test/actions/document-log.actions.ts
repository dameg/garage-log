import type { FastifyInstance } from 'fastify';

type DocumentLogListQueryValue = string | number | boolean | Date | undefined;

function toQueryString(query?: Record<string, DocumentLogListQueryValue>) {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    params.set(key, value instanceof Date ? value.toISOString() : String(value));
  }

  const serialized = params.toString();

  return serialized ? `?${serialized}` : '';
}

export async function createDocumentLog(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'POST',
    url: `/api/vehicles/${vehicleId}/document-logs`,
    headers: { cookie },
    payload,
  });
}

export async function listDocumentLogs(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  query?: Record<string, DocumentLogListQueryValue>,
) {
  return app.inject({
    method: 'GET',
    url: `/api/vehicles/${vehicleId}/document-logs${toQueryString(query)}`,
    headers: { cookie },
  });
}

export async function getDocumentLog(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentLogId: string,
) {
  return app.inject({
    method: 'GET',
    url: `/api/vehicles/${vehicleId}/document-logs/${documentLogId}`,
    headers: { cookie },
  });
}

export async function updateDocumentLog(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentLogId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'PATCH',
    url: `/api/vehicles/${vehicleId}/document-logs/${documentLogId}`,
    headers: { cookie },
    payload,
  });
}

export async function deleteDocumentLog(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentLogId: string,
) {
  return app.inject({
    method: 'DELETE',
    url: `/api/vehicles/${vehicleId}/document-logs/${documentLogId}`,
    headers: { cookie },
  });
}
