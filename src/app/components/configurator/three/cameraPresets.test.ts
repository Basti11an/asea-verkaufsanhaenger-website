import { describe, expect, it } from "vitest";
import { cameraPresets } from "./cameraPresets";

describe("configurator camera presets", () => {
  it("looks from the sales-hatch side in the front work-row view", () => {
    expect(cameraPresets.front.position[0]).toBe(0);
    expect(cameraPresets.front.position[2]).toBeLessThan(0);
  });

  it("starts the 3D view from the sales-hatch side", () => {
    expect(cameraPresets.three.position[2]).toBeLessThan(0);
    expect(cameraPresets.interior.position[2]).toBeLessThan(0);
  });

  it("looks from the closed-wall side in the rear work-row view", () => {
    expect(cameraPresets.rear.position[0]).toBe(0);
    expect(cameraPresets.rear.position[2]).toBeGreaterThan(0);
    expect(cameraPresets.rear.position[2]).toBeLessThan(7);
    expect(cameraPresets.rear.target[2]).toBeLessThan(0);
  });

  it("shows the closed wall at the top of the plan view", () => {
    expect(cameraPresets.top.up).toEqual([0, 0, 1]);
  });
});
