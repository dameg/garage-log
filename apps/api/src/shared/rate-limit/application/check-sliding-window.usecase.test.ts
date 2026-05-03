import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SlidingWindowRepository } from '../contracts/sliding-window.repository';

import { CheckSlidingWindowUseCase } from './check-sliding-window.usecase';

describe('CheckSlidingWindowUseCase', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults nowMs to Date.now()', async () => {
    const repo: SlidingWindowRepository = {
      hit: vi.fn().mockResolvedValue({
        allowed: true,
        count: 1,
        retryAfterSec: 0,
      }),
    };
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(456_789);
    const useCase = new CheckSlidingWindowUseCase(repo);

    await useCase.execute({
      key: 'rl:sw:login:user@example.com:127.0.0.1',
      limit: 5,
      windowSec: 600,
    });

    expect(nowSpy).toHaveBeenCalled();
    expect(repo.hit).toHaveBeenCalledWith({
      key: 'rl:sw:login:user@example.com:127.0.0.1',
      limit: 5,
      windowSec: 600,
      nowMs: 456_789,
    });
  });

  it('keeps explicit nowMs unchanged', async () => {
    const repo: SlidingWindowRepository = {
      hit: vi.fn().mockResolvedValue({
        allowed: false,
        count: 5,
        retryAfterSec: 60,
      }),
    };
    const useCase = new CheckSlidingWindowUseCase(repo);

    await useCase.execute({
      key: 'rl:sw:login:user@example.com:127.0.0.1',
      limit: 5,
      windowSec: 600,
      nowMs: 777,
    });

    expect(repo.hit).toHaveBeenCalledWith({
      key: 'rl:sw:login:user@example.com:127.0.0.1',
      limit: 5,
      windowSec: 600,
      nowMs: 777,
    });
  });
});
