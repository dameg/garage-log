import type { UserRepository } from '../../modules/auth/domain/user.repository';
import type { VehicleRepository } from '../../modules/vehicles/domain/vehicle.repository';
import type { CheckSlidingWindowUseCase } from '../rate-limit/application/check-sliding-window.usecase';
import type { ConsumeTokenBucketUseCase } from '../rate-limit/application/consume-token-bucket.usecase';
import type { RedisService } from '../redis/redis.service';

export type Deps = {
  redisService: RedisService;
  usersRepo: UserRepository;
  vehiclesRepo: VehicleRepository;
  consumeTokenBucketUseCase: ConsumeTokenBucketUseCase;
  checkSlidingWindowUseCase: CheckSlidingWindowUseCase;
};
