import type { FastifyReply, FastifyRequest } from 'fastify';
import { rateLimitKeys, rateLimitSubjects } from '../domain/rate-limit.keys';
import { CheckSlidingWindowUseCase } from '../application/check-sliding-window.usecase';
import { RateLimitExceededError } from '../../errors/rate-limit-error';

type SlidingWindowGuardOptions = {
  limit: number;
  windowSec: number;
  subjectFactory: (req: FastifyRequest) => string | null;
};

export function createSlidingWindowGuard(
  useCase: CheckSlidingWindowUseCase,
  options: SlidingWindowGuardOptions,
) {
  return async function slidingWindowGuard(req: FastifyRequest, reply: FastifyReply) {
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

export function loginEmailIpSubjectFactory(req: FastifyRequest): string | null {
  const body = req.body as { email?: string } | undefined;
  if (!body?.email) return null;

  return rateLimitSubjects.login(body.email, req.ip);
}
