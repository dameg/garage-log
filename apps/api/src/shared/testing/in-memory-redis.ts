import type Redis from 'ioredis';

import { RedisService } from '../redis/redis.service';

type Entry = {
  value: string;
  expiresAt: number | null;
};

function createPatternMatcher(pattern: string) {
  const escaped = pattern.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&').replaceAll('\\*', '.*');
  return new RegExp(`^${escaped}$`);
}

class InMemoryRedis {
  private readonly store = new Map<string, Entry>();

  private purgeExpired(key: string) {
    const entry = this.store.get(key);

    if (!entry) return;
    if (entry.expiresAt === null) return;
    if (entry.expiresAt > Date.now()) return;

    this.store.delete(key);
  }

  private ensureKey(key: string) {
    this.purgeExpired(key);
    return this.store.get(key) ?? null;
  }

  async get(key: string) {
    return this.ensureKey(key)?.value ?? null;
  }

  async set(key: string, value: string, mode?: 'EX', ttlSeconds?: number) {
    this.store.set(key, {
      value,
      expiresAt: mode === 'EX' && ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });

    return 'OK';
  }

  async del(...keys: string[]) {
    let deleted = 0;

    for (const key of keys) {
      if (this.ensureKey(key)) {
        this.store.delete(key);
        deleted += 1;
      }
    }

    return deleted;
  }

  async scan(cursor: string, _matchKeyword: 'MATCH', pattern: string, _countKeyword: 'COUNT') {
    const matcher = createPatternMatcher(pattern);
    const keys = [...this.store.keys()].filter((key) => {
      this.purgeExpired(key);
      return this.store.has(key) && matcher.test(key);
    });

    return [cursor === '0' ? '0' : cursor, keys] as [string, string[]];
  }

  async ttl(key: string) {
    const entry = this.ensureKey(key);

    if (!entry) return -2;
    if (entry.expiresAt === null) return -1;

    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
  }

  async incr(key: string) {
    const current = Number((await this.get(key)) ?? '0') + 1;
    const entry = this.ensureKey(key);

    this.store.set(key, {
      value: current.toString(),
      expiresAt: entry?.expiresAt ?? null,
    });

    return current;
  }

  async expire(key: string, ttlSeconds: number) {
    const entry = this.ensureKey(key);

    if (!entry) return 0;

    this.store.set(key, {
      ...entry,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });

    return 1;
  }

  async eval() {
    throw new Error('eval is not implemented in in-memory redis');
  }

  async ping() {
    return 'PONG';
  }

  async quit() {
    return 'OK';
  }
}

export function createInMemoryRedisService() {
  return new RedisService(new InMemoryRedis() as unknown as Redis);
}
