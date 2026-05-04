import { vehicleCache } from './vehicle.cache';

import type { RedisService } from '@/shared/redis/redis.service';

export class VehicleCacheInvalidator {
  constructor(private readonly redis: RedisService) {}

  async invalidateAfterCreated(input: { ownerId: string }) {
    await this.redis.delByPattern(vehicleCache.listPattern(input.ownerId));
  }

  async invalidateAfterUpdated(input: { ownerId: string; vehicleId: string }) {
    await Promise.all([
      this.redis.del(vehicleCache.detail(input.ownerId, input.vehicleId)),
      this.redis.delByPattern(vehicleCache.listPattern(input.ownerId)),
    ]);
  }

  async invalidateAfterDeleted(input: { ownerId: string; vehicleId: string }) {
    await Promise.all([
      this.redis.del(vehicleCache.detail(input.ownerId, input.vehicleId)),
      this.redis.delByPattern(vehicleCache.listPattern(input.ownerId)),
    ]);
  }
}
