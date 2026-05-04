import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { env } from '../config';
import type { Env } from '../config/env';
import { requireDatabaseUrl } from '../config/env';

const prismaOptions = {
  log: [{ emit: 'event', level: 'query' }],
} satisfies Prisma.PrismaClientOptions;

type AppPrismaClient = PrismaClient<typeof prismaOptions>;

let prismaSingleton: AppPrismaClient | null = null;

export function getPrisma(overrides?: Env): AppPrismaClient {
  if (prismaSingleton) return prismaSingleton;

  const effectiveEnv = overrides ?? env;

  const adapter = new PrismaPg({
    connectionString: requireDatabaseUrl(effectiveEnv),
  });

  prismaSingleton = new PrismaClient({
    adapter,
    ...prismaOptions,
  });

  prismaSingleton.$on('query', (e) => {
    console.log('🟣 Prisma Query:', e.query);
    console.log('🟡 Params:', e.params);
    console.log('⏱ Duration:', e.duration, 'ms');
  });

  return prismaSingleton;
}

export async function closePrisma() {
  if (!prismaSingleton) return;
  await prismaSingleton.$disconnect();
  prismaSingleton = null;
}
