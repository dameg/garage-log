import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TokenBucketRepository } from '../contracts/token-bucket.repository';

import { ConsumeTokenBucketUseCase } from './consume-token-bucket.usecase';

describe('ConsumeTokenBucketUseCase', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults tokensToConsume to 1 and nowMs to Date.now()', async () => {
    const repo: TokenBucketRepository = {
      consume: vi.fn().mockResolvedValue({
        allowed: true,
        remaining: 10,
        retryAfterSec: 0,
      }),
    };
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(123_456);
    const useCase = new ConsumeTokenBucketUseCase(repo);

    await useCase.execute({
      key: 'rl:tb:user:user-1',
      capacity: 60,
      refillRatePerSec: 1,
    });

    expect(nowSpy).toHaveBeenCalled();
    expect(repo.consume).toHaveBeenCalledWith({
      key: 'rl:tb:user:user-1',
      capacity: 60,
      refillRatePerSec: 1,
      tokensToConsume: 1,
      nowMs: 123_456,
    });
  });

  it('keeps explicit tokensToConsume and nowMs unchanged', async () => {
    const repo: TokenBucketRepository = {
      consume: vi.fn().mockResolvedValue({
        allowed: false,
        remaining: 0,
        retryAfterSec: 2,
      }),
    };
    const useCase = new ConsumeTokenBucketUseCase(repo);

    await useCase.execute({
      key: 'rl:tb:user:user-2',
      capacity: 10,
      refillRatePerSec: 2,
      tokensToConsume: 3,
      nowMs: 999,
    });

    expect(repo.consume).toHaveBeenCalledWith({
      key: 'rl:tb:user:user-2',
      capacity: 10,
      refillRatePerSec: 2,
      tokensToConsume: 3,
      nowMs: 999,
    });
  });
});
