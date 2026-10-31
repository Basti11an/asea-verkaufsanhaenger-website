import { describe, expect, it } from "vitest";
import { clampGasGriddleCenterCm, gasGriddleCenterToWorldOffset } from "./gasGriddlePlacement";

describe("gas griddle placement", () => {
  it("keeps the saved standard configuration centered at 180 cm", () => {
    expect(gasGriddleCenterToWorldOffset(180)).toBe(0);
  });

  it("moves in exact centimeter increments", () => {
    expect(gasGriddleCenterToWorldOffset(179)).toBeCloseTo(-0.01);
    expect(gasGriddleCenterToWorldOffset(181)).toBeCloseTo(0.01);
  });

  it("keeps the complete assembly inside the 360 cm interior", () => {
    expect(clampGasGriddleCenterCm(-50)).toBe(39);
    expect(clampGasGriddleCenterCm(500)).toBe(321);
  });
});
