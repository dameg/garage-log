export type ConsumeTokenBucketParams = {
  key: string;
  capacity: number;
  refillRatePerSec: number;
  tokensToConsume?: number;
  nowMs?: number;
};

export type ConsumeTokenBucketResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

export interface TokenBucketRepository {
  consume(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult>;
}
