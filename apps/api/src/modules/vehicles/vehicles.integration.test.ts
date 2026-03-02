import { describe, it, expect } from "vitest";
import { Test } from "@nestjs/testing";

import { VehiclesModule } from "./vehicles.module";
import { VehiclesController } from "./presentation/vehicles.controller";

describe("Vehicles (integration)", () => {
  it("creates and lists vehicles via controller (no HTTP)", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [VehiclesModule],
    }).compile();

    const controller = moduleRef.get(VehiclesController);

    await controller.create({
      name: "E46",
      brand: "BMW",
      model: "330i",
      year: 2002,
      mileage: 250000,
    });

    const list = await controller.list();

    expect(list.length).toBe(1);
    expect(list[0].name).toBe("E46");
  });
});
