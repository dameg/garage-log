export const apiRateLimitConfig = {
  capacity: 60,
  refillRatePerSec: 1,
} as const;

export const loginRateLimitConfig = {
  limit: 5,
  windowSec: 600,
} as const;
