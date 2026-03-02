import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../app.module";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DB E2E DATABASE_URL =", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing for DB e2e tests");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

describe("Vehicles (e2e - db)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    await prisma.vehicle.deleteMany();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    await prisma.$disconnect();
  });

  it("POST /api/vehicles persists in DB", async () => {
    await request(app.getHttpServer())
      .post("/api/vehicles")
      .send({
        name: "E46",
        brand: "BMW",
        model: "330i",
        year: 2002,
        mileage: 250000,
      })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get("/api/vehicles")
      .expect(200);

    expect(res.body[0].name).toBe("E46");
  });
});
