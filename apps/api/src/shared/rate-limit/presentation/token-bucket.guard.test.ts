import type { FastifyRequest } from 'fastify';
import { describe, expect, it } from 'vitest';
import { RateLimitExceededError } from '../../errors/rate-limit-error';
import { SpyConsumeTokenBucketUseCase } from '../../../test/doubles/rate-limit/spy-consume-token-bucket.usecase';
import { createTokenBucketGuard } from './token-bucket.guard';

describe('createTokenBucketGuard', () => {
  it('uses a user subject when req.user.sub is present', async () => {
    const useCase = new SpyConsumeTokenBucketUseCase();
    const guard = createTokenBucketGuard(useCase, {
      capacity: 60,
      refillRatePerSec: 1,
    });

    await guard({
      ip: '127.0.0.1',
      user: { sub: 'user-1' },
    } as FastifyRequest);

    expect(useCase.lastParams).toEqual({
      key: 'rl:tb:user:user-1',
      capacity: 60,
      refillRatePerSec: 1,
      tokensToConsume: 1,
    });
  });

  it('falls back to the ip subject when the user is missing', async () => {
    const useCase = new SpyConsumeTokenBucketUseCase();
    const guard = createTokenBucketGuard(useCase, {
      capacity: 10,
      refillRatePerSec: 2,
    });

    await guard({
      ip: '10.0.0.1',
    } as FastifyRequest);

    expect(useCase.lastParams).toEqual({
      key: 'rl:tb:ip:10.0.0.1',
      capacity: 10,
      refillRatePerSec: 2,
      tokensToConsume: 1,
    });
  });

  it('throws RateLimitExceededError when the request is denied', async () => {
    const useCase = new SpyConsumeTokenBucketUseCase({
      allowed: false,
      remaining: 0,
      retryAfterSec: 5,
    });
    const guard = createTokenBucketGuard(useCase, {
      capacity: 60,
      refillRatePerSec: 1,
    });

    await expect(
      guard({
        ip: '127.0.0.1',
      } as FastifyRequest),
    ).rejects.toEqual(new RateLimitExceededError('Too many requests', 5));
  });
});
