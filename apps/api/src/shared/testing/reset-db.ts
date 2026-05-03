import type { PrismaClient } from '@prisma/client';

export async function resetDb(prisma: PrismaClient) {
  await prisma.document.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
}
