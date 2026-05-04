import { describe, expect, it } from 'vitest';

import { createCacheKey, hashCacheParams } from './cache-key';

describe('createCacheKey', () => {
  it('joins non-empty parts with colons', () => {
    expect(createCacheKey('api', 'v1', 'vehicles', 'user-1')).toBe('api:v1:vehicles:user-1');
  });

  it('skips null and undefined parts', () => {
    expect(createCacheKey('api', null, 'vehicles', undefined, 'user-1')).toBe(
      'api:vehicles:user-1',
    );
  });
});

describe('hashCacheParams', () => {
  it('returns stable hash for the same value', () => {
    const value = { page: 1, limit: 10, sortBy: 'createdAt' };

    expect(hashCacheParams(value)).toBe(hashCacheParams(value));
  });

  it('returns different hashes for different values', () => {
    expect(hashCacheParams({ page: 1, limit: 10 })).not.toBe(
      hashCacheParams({ page: 2, limit: 10 }),
    );
  });
});
