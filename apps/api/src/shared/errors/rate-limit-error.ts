export class RateLimitExceededError extends Error {
  constructor(
    message = 'Rate limit exceeded',
    public readonly retryAfterSec: number = 0,
  ) {
    super(message);
    this.name = 'RateLimitExceededError';
  }
}
