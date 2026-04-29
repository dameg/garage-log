import type { FastifyReply } from 'fastify';

import { env } from '../config';

export function setAuthCookie(reply: FastifyReply, token: string) {
  reply.setCookie('access_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function clearAuthCookie(reply: FastifyReply) {
  reply.clearCookie('access_token', {
    path: '/',
  });
}
