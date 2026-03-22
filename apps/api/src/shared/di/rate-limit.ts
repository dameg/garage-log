import { RedisService } from '../redis/redis.service';
import { RedisTokenBucketRepository } from '../rate-limit/infrastructure/redis/redis-token-bucket.repository';
import { RedisSlidingWindowRepository } from '../rate-limit/infrastructure/redis/redis-sliding-window.repository';
import { ConsumeTokenBucketUseCase } from '../rate-limit/application/consume-token-bucket.usecase';
import { CheckSlidingWindowUseCase } from '../rate-limit/application/check-sliding-window.usecase';

export function createRateLimitDeps(redisService: RedisService) {
  const tokenBucketRepository = new RedisTokenBucketRepository(redisService);
  const slidingWindowRepository = new RedisSlidingWindowRepository(redisService);

  const consumeTokenBucketUseCase = new ConsumeTokenBucketUseCase(tokenBucketRepository);

  const checkSlidingWindowUseCase = new CheckSlidingWindowUseCase(slidingWindowRepository);

  return {
    consumeTokenBucketUseCase,
    checkSlidingWindowUseCase,
  };
}
