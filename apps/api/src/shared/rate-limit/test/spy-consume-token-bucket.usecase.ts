import type { ConsumeTokenBucketUseCasePort } from '../application/consume-token-bucket.usecase.port';
import type {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
} from '../contracts/token-bucket.repository';

export class SpyConsumeTokenBucketUseCase implements ConsumeTokenBucketUseCasePort {
  lastParams: ConsumeTokenBucketParams | null = null;

  constructor(
    private readonly result: ConsumeTokenBucketResult = {
      allowed: true,
      remaining: 999,
      retryAfterSec: 0,
    },
  ) {}

  async execute(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult> {
    this.lastParams = params;
    return this.result;
  }
}
