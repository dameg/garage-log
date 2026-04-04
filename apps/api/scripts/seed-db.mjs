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
const DOCUMENT_LOGS_PER_VEHICLE = 30;
const DOCUMENT_LOG_BATCH_SIZE = 5000;

function randomPastDateWithinYears(yearsBack) {
  return faker.date.between({
    from: new Date(Date.now() - yearsBack * 365 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildDocumentLog(vehicle, index) {
  const type = index % 2 === 0 ? 'insurance' : 'inspection';
  const validFrom = randomPastDateWithinYears(3);
  const validTo = addDays(validFrom, faker.number.int({ min: 30, max: 730 }));
  const issuedAt = faker.datatype.boolean({ probability: 0.85 })
    ? faker.date.between({
        from: addDays(validFrom, -30),
        to: new Date(Math.min(validTo.getTime(), Date.now())),
      })
    : null;

  return {
    id: randomUUID(),
    type,
    title:
      type === 'insurance'
        ? `${faker.company.name()} policy renewal`
        : `${faker.company.name()} inspection report`,
    issuer: faker.datatype.boolean({ probability: 0.8 }) ? faker.company.name() : null,
    validFrom,
    validTo,
    issuedAt,
    cost: faker.datatype.boolean({ probability: 0.75 })
      ? faker.number.float({ min: 80, max: 2500, fractionDigits: 2 })
      : null,
    note: faker.datatype.boolean({ probability: 0.5 }) ? faker.lorem.sentence() : null,
    ownerId: vehicle.ownerId,
    vehicleId: vehicle.id,
    createdAt: faker.date.between({
      from: validFrom,
      to: new Date(),
    }),
  };
}

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

  // ---------- document logs ----------

  let createdDocumentLogs = 0;
  let batch = [];

  for (const vehicle of vehicles) {
    for (let i = 0; i < DOCUMENT_LOGS_PER_VEHICLE; i++) {
      batch.push(buildDocumentLog(vehicle, i));

      if (batch.length === DOCUMENT_LOG_BATCH_SIZE) {
        await prisma.documentLog.createMany({
          data: batch,
        });

        createdDocumentLogs += batch.length;
        batch = [];
      }
    }
  }

  if (batch.length > 0) {
    await prisma.documentLog.createMany({
      data: batch,
    });

    createdDocumentLogs += batch.length;
  }

  console.log(`📄 Document logs created: ${createdDocumentLogs}`);

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
