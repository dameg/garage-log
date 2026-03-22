import type {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
  TokenBucketRepository,
} from '../domain/token-bucket.repository';

export class ConsumeTokenBucketUseCase {
  constructor(private readonly repo: TokenBucketRepository) {}

  async execute(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult> {
    return this.repo.consume({
      ...params,
      tokensToConsume: params.tokensToConsume ?? 1,
      nowMs: params.nowMs ?? Date.now(),
    });
  }
}
