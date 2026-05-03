import type {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
} from '../contracts/token-bucket.repository';

export type ConsumeTokenBucketUseCasePort = {
  execute(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult>;
};
