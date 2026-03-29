import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const PASSWORD = 'password123';
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // ---------- demo user ----------

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@garage-log.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'demo@garage-log.com',
      passwordHash,
      createdAt: new Date(),
    },
  });

  console.log('👤 Demo user created');
  console.log('email: demo@garage-log.com');
  console.log('password:', PASSWORD);

  // ---------- extra users (batch insert for speed) ----------

  const users = [demoUser];

  const extraUsers = [];

  for (let i = 0; i < 4; i++) {
    extraUsers.push({
      id: randomUUID(),
      email: faker.internet.email(),
      passwordHash,
      createdAt: new Date(),
    });
  }

  await prisma.user.createMany({
    data: extraUsers,
  });

  users.push(...extraUsers);

  console.log(`👥 Users created: ${users.length}`);

  // ---------- vehicles ----------

  const vehicles = [];

  for (let i = 0; i < 7000; i++) {
    const owner = faker.helpers.arrayElement(users);

    vehicles.push({
      id: randomUUID(),
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      vin: faker.vehicle.vin(),
      year: faker.number.int({ min: 1995, max: 2024 }),
      mileage: faker.number.int({ min: 0, max: 250000 }),
      ownerId: owner.id,
      createdAt: new Date(),
    });
  }

  await prisma.vehicle.createMany({
    data: vehicles,
  });

  console.log(`🚗 Vehicles created: ${vehicles.length}`);

  console.log('✅ Seeding done');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
