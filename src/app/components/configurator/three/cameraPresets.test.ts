import { describe, expect, it } from "vitest";
import { cameraPresets } from "./cameraPresets";

describe("configurator camera presets", () => {
  it("looks from the sales-hatch side in the front work-row view", () => {
    expect(cameraPresets.front.position[0]).toBe(-0.2);
    expect(cameraPresets.front.position[2]).toBeLessThan(0);
  });

  it("looks from the closed-wall side in the rear work-row view", () => {
    expect(cameraPresets.rear.position[0]).toBe(-0.2);
    expect(cameraPresets.rear.position[2]).toBeGreaterThan(0);
  });
});
