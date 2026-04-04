import type { FastifyInstance } from 'fastify';

export async function registerAndGetCookie(app: FastifyInstance, email = 'test@test.com') {
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      email,
      password: 'password123',
    },
  });

  if (res.statusCode !== 201) {
    throw new Error(`Register failed: ${res.body}`);
  }

  const cookie = res.cookies.find((c) => c.name === 'access_token');

  if (!cookie) {
    throw new Error('No access_token cookie returned');
  }

  return {
    email,
    cookie: `${cookie.name}=${cookie.value}`,
  };
}
