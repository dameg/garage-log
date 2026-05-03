import type { FastifyRequest } from 'fastify';

import { RateLimitExceededError } from '../../errors/rate-limit-error';
import type { CheckSlidingWindowUseCasePort } from '../application/check-sliding-window.usecase.port';
import { rateLimitKeys, rateLimitSubjects } from '../domain/rate-limit.keys';

type SlidingWindowGuardOptions = {
  limit: number;
  windowSec: number;
  subjectFactory: (req: FastifyRequest) => string | null;
};

export function createSlidingWindowGuard(
  useCase: CheckSlidingWindowUseCasePort,
  options: SlidingWindowGuardOptions,
) {
  return async function slidingWindowGuard(req: FastifyRequest) {
    const subject = options.subjectFactory(req);

    if (!subject) return;

    const result = await useCase.execute({
      key: rateLimitKeys.slidingWindow(subject),
      limit: options.limit,
      windowSec: options.windowSec,
    });

    if (!result.allowed) {
      throw new RateLimitExceededError('Too many requests', result.retryAfterSec);
    }
  };
}

export function loginEmailIpSubject(req: FastifyRequest): string | null {
  const body = req.body as { email?: string } | undefined;
  if (!body?.email) return null;

  return rateLimitSubjects.login(body.email, req.ip);
}
