import Redis from 'ioredis';

export function createRedisClient(url: string) {
  const redis = new Redis(url);

  redis.on('connect', () => {
    console.log('Redis connected');
  });

  redis.on('error', (error) => {
    console.error('Redis error', error);
  });

  return redis;
}
