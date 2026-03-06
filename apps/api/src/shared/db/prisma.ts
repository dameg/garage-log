import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../config';
import type { Env } from '../config/env';
import { requireDatabaseUrl } from '../config/env';

let prismaSingleton: PrismaClient | null = null;

export function getPrisma(overrides?: Env): PrismaClient {
  if (prismaSingleton) return prismaSingleton;

  const effectiveEnv = overrides ?? env;

  const adapter = new PrismaPg({
    connectionString: requireDatabaseUrl(effectiveEnv),
  });

  prismaSingleton = new PrismaClient({ adapter });
  return prismaSingleton;
}

export async function closePrisma() {
  if (!prismaSingleton) return;
  await prismaSingleton.$disconnect();
  prismaSingleton = null;
}
