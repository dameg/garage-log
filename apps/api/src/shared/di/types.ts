import { UserRepository } from '../../modules/auth/domain/user.repository';
import type { VehicleRepository } from '../../modules/vehicles/domain/vehicle.repository';
import type { RedisService } from '../redis/redis.service';

export type Deps = {
  redisService: RedisService;
  usersRepo: UserRepository;
  vehiclesRepo: VehicleRepository;
};
