import {
  ConsumeTokenBucketParams,
  ConsumeTokenBucketResult,
} from '../domain/token-bucket.repository';

export type ConsumeTokenBucketUseCasePort = {
  execute(params: ConsumeTokenBucketParams): Promise<ConsumeTokenBucketResult>;
};
