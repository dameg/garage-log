import type { FastifyRequest } from 'fastify';
import { describe, expect, it } from 'vitest';
import { RateLimitExceededError } from '../../errors/rate-limit-error';
import { SpyCheckSlidingWindowUseCase } from '../../../test/doubles/rate-limit/spy-check-sliding-window.usecase';
import {
  createSlidingWindowGuard,
  loginEmailIpSubjectFactory,
} from './sliding-window.guard';

describe('createSlidingWindowGuard', () => {
  it('does not call the use case when the subjectFactory returns null', async () => {
    const useCase = new SpyCheckSlidingWindowUseCase();
    const guard = createSlidingWindowGuard(useCase, {
      limit: 5,
      windowSec: 600,
      subjectFactory: () => null,
    });

    await guard({} as FastifyRequest);

    expect(useCase.lastParams).toBeNull();
  });

  it('builds the sliding window key from the subject', async () => {
    const useCase = new SpyCheckSlidingWindowUseCase();
    const guard = createSlidingWindowGuard(useCase, {
      limit: 5,
      windowSec: 600,
      subjectFactory: () => 'login:user@example.com:127.0.0.1',
    });

    await guard({
      ip: '127.0.0.1',
    } as FastifyRequest);

    expect(useCase.lastParams).toEqual({
      key: 'rl:sw:login:user@example.com:127.0.0.1',
      limit: 5,
      windowSec: 600,
    });
  });

  it('throws RateLimitExceededError when the request is denied', async () => {
    const useCase = new SpyCheckSlidingWindowUseCase({
      allowed: false,
      count: 5,
      retryAfterSec: 120,
    });
    const guard = createSlidingWindowGuard(useCase, {
      limit: 5,
      windowSec: 600,
      subjectFactory: () => 'login:user@example.com:127.0.0.1',
    });

    await expect(
      guard({
        ip: '127.0.0.1',
      } as FastifyRequest),
    ).rejects.toEqual(new RateLimitExceededError('Too many requests', 120));
  });
});

describe('loginEmailIpSubjectFactory', () => {
  it('returns a lowercased login subject when the email exists in the body', () => {
    expect(
      loginEmailIpSubjectFactory({
        body: { email: 'USER@Example.COM' },
        ip: '127.0.0.1',
      } as FastifyRequest),
    ).toBe('login:user@example.com:127.0.0.1');
  });

  it('returns null when the body has no email', () => {
    expect(
      loginEmailIpSubjectFactory({
        body: {},
        ip: '127.0.0.1',
      } as FastifyRequest),
    ).toBeNull();
  });
});
