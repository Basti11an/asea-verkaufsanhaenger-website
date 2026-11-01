import { describe, expect, it } from "vitest";
import { cameraPresets } from "./cameraPresets";

describe("configurator camera presets", () => {
  it("looks into the trailer from the customer side in the front view", () => {
    expect(cameraPresets.front.position[2]).toBeGreaterThan(0);
    expect(cameraPresets.front.target[2]).toBeLessThan(cameraPresets.front.position[2]);
  });

  it("starts the 3D view inside the rear entrance", () => {
    expect(cameraPresets.three.position[0]).toBeGreaterThan(0);
    expect(cameraPresets.interior.position[0]).toBeGreaterThan(0);
    expect(cameraPresets.interior.target[0]).toBeLessThan(cameraPresets.interior.position[0]);
  });

  it("looks toward the customer side from the seller perspective", () => {
    expect(cameraPresets.rear.position[2]).toBeLessThan(0);
    expect(cameraPresets.rear.target[2]).toBeGreaterThan(cameraPresets.rear.position[2]);
  });

  it("shows the closed wall at the top of the plan view", () => {
    expect(cameraPresets.top.up).toEqual([0, 0, -1]);
  });
});
