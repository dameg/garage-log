import { createCacheKey } from '@/shared/cache';
const NS = createCacheKey('api', 'v1', 'vehicles');

export const vehicleCache = {
  base: (userId: string) => createCacheKey(NS, userId),
  list: (userId: string, paramsHash: string) =>
    createCacheKey(vehicleCache.base(userId), 'list', paramsHash),
  detail: (userId: string, vehicleId: string) =>
    createCacheKey(vehicleCache.base(userId), 'detail', vehicleId),
  listPattern: (userId: string) => createCacheKey(vehicleCache.base(userId), 'list', '*'),
};
