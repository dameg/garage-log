import type { FastifyInstance } from 'fastify';

export async function createVehicle(
  app: FastifyInstance,
  cookie: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'POST',
    url: '/api/vehicles',
    headers: { cookie },
    payload,
  });
}

export async function listVehicles(app: FastifyInstance, cookie: string) {
  return app.inject({
    method: 'GET',
    url: '/api/vehicles',
    headers: { cookie },
  });
}

export async function getVehicle(app: FastifyInstance, cookie: string, id: string) {
  return app.inject({
    method: 'GET',
    url: `/api/vehicles/${id}`,
    headers: { cookie },
  });
}

export async function updateVehicle(
  app: FastifyInstance,
  cookie: string,
  id: string,
  payload: Record<string, unknown>,
) {
  return app.inject({
    method: 'PATCH',
    url: `/api/vehicles/${id}`,
    headers: { cookie },
    payload,
  });
}

export async function deleteVehicle(app: FastifyInstance, cookie: string, id: string) {
  return app.inject({
    method: 'DELETE',
    url: `/api/vehicles/${id}`,
    headers: { cookie },
  });
}
