import type { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function requireAuthGuard(req: FastifyRequest, _reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    throw new UnauthorizedError('Authentication required');
  }
}
