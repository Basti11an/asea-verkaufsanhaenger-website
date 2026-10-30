import { describe, expect, it } from "vitest";
import { cameraPresets } from "./cameraPresets";

describe("configurator camera presets", () => {
  it("looks from the drawbar/front end in the front view", () => {
    expect(cameraPresets.front.position[0]).toBeLessThan(0);
    expect(cameraPresets.front.target[0]).toBeGreaterThan(cameraPresets.front.position[0]);
  });

  it("starts the 3D view inside the rear entrance", () => {
    expect(cameraPresets.three.position[0]).toBeGreaterThan(0);
    expect(cameraPresets.interior.position[0]).toBeGreaterThan(0);
    expect(cameraPresets.interior.target[0]).toBeLessThan(cameraPresets.interior.position[0]);
  });

  it("looks into the trailer from the rear entrance", () => {
    expect(cameraPresets.rear.position[0]).toBeGreaterThan(0);
    expect(cameraPresets.rear.target[0]).toBeLessThan(cameraPresets.rear.position[0]);
  });

  it("shows the closed wall at the top of the plan view", () => {
    expect(cameraPresets.top.up).toEqual([0, 0, -1]);
  });
});
