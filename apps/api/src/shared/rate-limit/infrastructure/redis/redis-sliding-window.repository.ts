import type {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
  SlidingWindowRepository,
} from '../../domain/sliding-window.repository';
import type { RedisService } from '../../../redis/redis.service';

const HIT_SLIDING_WINDOW_LUA = `
    local key = KEYS[1]

    local limit = tonumber(ARGV[1])
    local windowSec = tonumber(ARGV[2])
    local nowMs = tonumber(ARGV[3])
    local member = ARGV[4]

    local windowStartMs = nowMs - (windowSec * 1000)

    redis.call('ZREMRANGEBYSCORE', key, 0, windowStartMs)

    local count = redis.call('ZCARD', key)

    if count >= limit then
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retryAfterSec = 1

    if oldest[2] ~= nil then
        local oldestMs = tonumber(oldest[2])
        retryAfterSec = math.max(1, math.ceil(((oldestMs + windowSec * 1000) - nowMs) / 1000))
    end

    return { 0, count, retryAfterSec }
    end

    redis.call('ZADD', key, nowMs, member)
    redis.call('EXPIRE', key, windowSec)

    count = redis.call('ZCARD', key)

    return { 1, count, 0 }
`;

export class RedisSlidingWindowRepository implements SlidingWindowRepository {
  constructor(private readonly redisService: RedisService) {}

  async hit(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult> {
    const nowMs = params.nowMs ?? Date.now();
    const member = `${nowMs}:${Math.random().toString(36).slice(2)}`;

    const result = (await this.redisService.eval(
      HIT_SLIDING_WINDOW_LUA,
      1,
      params.key,
      params.limit.toString(),
      params.windowSec.toString(),
      nowMs.toString(),
      member,
    )) as [number, number, number];

    const [allowed, count, retryAfterSec] = result;

    return {
      allowed: allowed === 1,
      count,
      retryAfterSec,
    };
  }
}
