import type { CheckSlidingWindowUseCasePort } from '../rate-limit/application/check-sliding-window.usecase.port';
import type { ConsumeTokenBucketUseCasePort } from '../rate-limit/application/consume-token-bucket.usecase.port';
import type { RedisService } from '../redis/redis.service';

import type { UserRepository } from '@/modules/auth/contracts/user.repository';
import type { DocumentRepository } from '@/modules/vehicle/contracts/document.repository';
import type { VehicleRepository } from '@/modules/vehicle/contracts/vehicle.repository';

export type AppContainer = {
  redisService: RedisService;
  userRepository: UserRepository;
  vehicleRepository: VehicleRepository;
  documentRepository: DocumentRepository;
  consumeTokenBucketUseCase: ConsumeTokenBucketUseCasePort;
  checkSlidingWindowUseCase: CheckSlidingWindowUseCasePort;
};
