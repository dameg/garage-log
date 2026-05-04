import crypto from 'node:crypto';

export function createCacheKey(...parts: Array<string | number | null | undefined>) {
  return parts.filter(Boolean).join(':');
}

export function hashCacheParams(value: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
}
