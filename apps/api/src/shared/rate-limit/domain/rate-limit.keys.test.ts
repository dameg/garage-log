import { describe, expect, it } from 'vitest';
import { rateLimitKeys, rateLimitSubjects } from './rate-limit.keys';

describe('rateLimitKeys', () => {
  it('builds token bucket keys with the expected prefix', () => {
    expect(rateLimitKeys.tokenBucket('user:user-1')).toBe('rl:tb:user:user-1');
  });

  it('builds sliding window keys with the expected prefix', () => {
    expect(rateLimitKeys.slidingWindow('login:test@example.com:127.0.0.1')).toBe(
      'rl:sw:login:test@example.com:127.0.0.1',
    );
  });
});

describe('rateLimitSubjects', () => {
  it('builds a user subject', () => {
    expect(rateLimitSubjects.user('user-1')).toBe('user:user-1');
  });

  it('builds an ip subject', () => {
    expect(rateLimitSubjects.ip('127.0.0.1')).toBe('ip:127.0.0.1');
  });

  it('builds a login subject and lowercases the email', () => {
    expect(rateLimitSubjects.login('USER@Example.COM', '127.0.0.1')).toBe(
      'login:user@example.com:127.0.0.1',
    );
  });
});
