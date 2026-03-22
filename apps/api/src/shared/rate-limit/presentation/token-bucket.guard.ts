import type { FastifyReply, FastifyRequest } from 'fastify';
import { rateLimitKeys, rateLimitSubjects } from '../domain/rate-limit.keys';
import { ConsumeTokenBucketUseCase } from '../application/consume-token-bucket.usecase';
import { RateLimitExceededError } from '../../errors/rate-limit-error';

type TokenBucketGuardOptions = {
  capacity: number;
  refillRatePerSec: number;
};

export function createTokenBucketGuard(
  useCase: ConsumeTokenBucketUseCase,
  options: TokenBucketGuardOptions,
) {
  return async function tokenBucketGuard(req: FastifyRequest, reply: FastifyReply) {
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
