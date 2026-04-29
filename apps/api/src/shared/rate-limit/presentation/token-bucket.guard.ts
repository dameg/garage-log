import type { FastifyRequest } from 'fastify';

import { RateLimitExceededError } from '../../errors/rate-limit-error';
import type { ConsumeTokenBucketUseCasePort } from '../application/consume-token-bucket.usecase.port';
import { rateLimitKeys, rateLimitSubjects } from '../domain/rate-limit.keys';

type TokenBucketGuardOptions = {
  capacity: number;
  refillRatePerSec: number;
};

export function createTokenBucketGuard(
  useCase: ConsumeTokenBucketUseCasePort,
  options: TokenBucketGuardOptions,
) {
  return async function tokenBucketGuard(req: FastifyRequest) {
    const userId = (req as FastifyRequest & { user?: { sub?: string } }).user?.sub;
    const ip = req.ip;

    const subject = userId ? rateLimitSubjects.user(userId) : rateLimitSubjects.ip(ip);

    const result = await useCase.execute({
      key: rateLimitKeys.tokenBucket(subject),
      capacity: options.capacity,
      refillRatePerSec: options.refillRatePerSec,
      tokensToConsume: 1,
    });

    if (!result.allowed) {
      throw new RateLimitExceededError('Too many requests', result.retryAfterSec);
    }
  };
}
