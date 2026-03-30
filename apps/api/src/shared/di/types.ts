import type { UserRepository } from '../../modules/auth/domain/user.repository';
import type { DocumentLogRepository } from '../../modules/documents-log/domain/document-log.repository';
import type { VehicleRepository } from '../../modules/vehicles/domain/vehicle.repository';
import type { CheckSlidingWindowUseCasePort } from '../rate-limit/application/check-sliding-window.usecase.port';
import type { ConsumeTokenBucketUseCasePort } from '../rate-limit/application/consume-token-bucket.usecase.port';
import type { RedisService } from '../redis/redis.service';

export type AppContainer = {
  redisService: RedisService;
  usersRepo: UserRepository;
  vehiclesRepo: VehicleRepository;
  documentLogsRepo: DocumentLogRepository;
  consumeTokenBucketUseCase: ConsumeTokenBucketUseCasePort;
  checkSlidingWindowUseCase: CheckSlidingWindowUseCasePort;
};
