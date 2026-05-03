import type { FastifyInstance } from 'fastify';

type DocumentsListQueryValue = string | number | boolean | Date | undefined | null;

function toQueryString(query?: Record<string, DocumentsListQueryValue>) {
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

export async function createDocument(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'POST',
    url: `/api/vehicles/${vehicleId}/documents`,
    headers: { cookie },
    payload,
  });
}

export async function listDocuments(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  query?: Record<string, DocumentsListQueryValue>,
) {
  return app.inject({
    method: 'GET',
    url: `/api/vehicles/${vehicleId}/documents${toQueryString(query)}`,
    headers: { cookie },
  });
}

export async function getDocument(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentId: string,
) {
  return app.inject({
    method: 'GET',
    url: `/api/vehicles/${vehicleId}/documents/${documentId}`,
    headers: { cookie },
  });
}

export async function updateDocument(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentId: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'PATCH',
    url: `/api/vehicles/${vehicleId}/documents/${documentId}`,
    headers: { cookie },
    payload,
  });
}

export async function deleteDocument(
  app: FastifyInstance,
  cookie: string,
  vehicleId: string,
  documentId: string,
) {
  return app.inject({
    method: 'DELETE',
    url: `/api/vehicles/${vehicleId}/documents/${documentId}`,
    headers: { cookie },
  });
}
