import type Redis from 'ioredis';

export class RedisService {
  public constructor(private readonly redis: Redis) {}

  public async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await this.redis.set(key, value);
  }

  public async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  public async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  public async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlSeconds);
  }

  public async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.set(key, serializedValue, 'EX', ttlSeconds);
      return;
    }

    await this.redis.set(key, serializedValue);
  }

  public async getOrSetJSON<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cachedValue = await this.getJSON<T>(key);

    if (cachedValue !== null) {
      return cachedValue;
    }

    const freshValue = await factory();
    await this.setJSON(key, freshValue, ttlSeconds);

    return freshValue;
  }

  public async incrementInWindow(
    key: string,
    windowSeconds: number,
  ): Promise<{
    count: number;
    ttl: number;
  }> {
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, windowSeconds);
    }

    const ttl = await this.redis.ttl(key);

    return {
      count,
      ttl,
    };
  }

  async eval<T = unknown>(
    script: string,
    keysCount: number,
    ...args: (string | number)[]
  ): Promise<T> {
    const result = await this.redis.eval(script, keysCount, ...args);
    return result as T;
  }

  public async ping(): Promise<string> {
    return this.redis.ping();
  }

  public async quit(): Promise<void> {
    await this.redis.quit();
  }
}
