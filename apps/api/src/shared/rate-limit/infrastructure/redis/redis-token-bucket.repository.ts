import type {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
  TokenBucketRepository,
} from '../../domain/token-bucket.repository';
import type { RedisService } from '../../../redis/redis.service';

const CONSUME_TOKEN_BUCKET_LUA = `
local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRatePerSec = tonumber(ARGV[2])
local tokensToConsume = tonumber(ARGV[3])
local nowMs = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefillMs')
local tokens = tonumber(bucket[1])
local lastRefillMs = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
end

if lastRefillMs == nil then
  lastRefillMs = nowMs
end

local elapsedMs = math.max(0, nowMs - lastRefillMs)
local refill = (elapsedMs / 1000.0) * refillRatePerSec
tokens = math.min(capacity, tokens + refill)

local allowed = 0
local retryAfterSec = 0

if tokens >= tokensToConsume then
  tokens = tokens - tokensToConsume
  allowed = 1
else
  local missing = tokensToConsume - tokens
  retryAfterSec = math.ceil(missing / refillRatePerSec)
end

redis.call('HSET', key, 'tokens', tokens, 'lastRefillMs', nowMs)

local ttlSec = math.ceil(capacity / refillRatePerSec) * 2
if ttlSec > 0 then
  redis.call('EXPIRE', key, ttlSec)
end

return { allowed, math.floor(tokens), retryAfterSec }
`;

export class RedisTokenBucketRepository implements TokenBucketRepository {
  constructor(private readonly redisService: RedisService) {}

  async consume(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult> {
    const result = (await this.redisService.eval(
      CONSUME_TOKEN_BUCKET_LUA,
      1,
      params.key,
      params.capacity.toString(),
      params.refillRatePerSec.toString(),
      (params.tokensToConsume ?? 1).toString(),
      (params.nowMs ?? Date.now()).toString(),
    )) as [number, number, number];

    const [allowed, remaining, retryAfterSec] = result;

    return {
      allowed: allowed === 1,
      remaining,
      retryAfterSec,
    };
  }
}
