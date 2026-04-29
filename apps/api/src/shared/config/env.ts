import { z } from 'zod';

import { ConfigError } from '../errors/config-error';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  FRONTEND_URLS: z
    .string()
    .default('http://localhost:5173')
    .transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  DATABASE_URL: z.url().optional(),
  COOKIE_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  REDIS_URL: z.string().min(1),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    const formatted = parsed.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    console.error('❌ Invalid environment variables:');
    console.error(formatted);

    throw new ConfigError('Invalid environment variables');
  }

  if (parsed.data.NODE_ENV !== 'test' && !parsed.data.DATABASE_URL) {
    throw new ConfigError("DATABASE_URL is required when NODE_ENV is not 'test'");
  }

  return parsed.data;
}

export function requireDatabaseUrl(env: Env): string {
  if (!env.DATABASE_URL) {
    throw new ConfigError('DATABASE_URL is missing');
  }
  return env.DATABASE_URL;
}
