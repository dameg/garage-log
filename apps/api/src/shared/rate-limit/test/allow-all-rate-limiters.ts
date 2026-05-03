import type { CheckSlidingWindowUseCasePort } from '../application/check-sliding-window.usecase.port';
import type { ConsumeTokenBucketUseCasePort } from '../application/consume-token-bucket.usecase.port';
import type {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
} from '../contracts/sliding-window.repository';
import type {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
} from '../contracts/token-bucket.repository';

export class AllowAllConsumeTokenBucketUseCase implements ConsumeTokenBucketUseCasePort {
  async execute(_: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult> {
    return {
      allowed: true,
      remaining: 999,
      retryAfterSec: 0,
    };
  }
}

export class AllowAllCheckSlidingWindowUseCase implements CheckSlidingWindowUseCasePort {
  async execute(_: HitSlidingWindowParams): Promise<HitSlidingWindowResult> {
    return {
      allowed: true,
      count: 1,
      retryAfterSec: 0,
    };
  }
}
