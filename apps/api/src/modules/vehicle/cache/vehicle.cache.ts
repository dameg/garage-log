import { createCacheKey } from '@/shared/cache';
const NS = createCacheKey('api', 'v1', 'vehicles');

export const vehicleCache = {
  base: (ownerId: string) => createCacheKey(NS, ownerId),
  list: (ownerId: string, paramsHash: string) =>
    createCacheKey(vehicleCache.base(ownerId), 'list', paramsHash),
  detail: (ownerId: string, vehicleId: string) =>
    createCacheKey(vehicleCache.base(ownerId), 'detail', vehicleId),
  listPattern: (ownerId: string) => createCacheKey(vehicleCache.base(ownerId), 'list', '*'),
};
