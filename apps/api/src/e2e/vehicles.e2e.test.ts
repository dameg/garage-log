import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../app.module";

describe("Vehicles (e2e)", () => {
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST then GET vehicles", async () => {
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
