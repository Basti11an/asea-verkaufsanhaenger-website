import { describe, expect, it } from "vitest";
import { sidebarEquipmentIds, standardEquipment, trailerConfiguration } from "./defaultConfiguration";

describe("default configurator configuration", () => {
  it("starts with an empty trailer and no selected equipment", () => {
    expect(standardEquipment).toEqual([]);
    expect(sidebarEquipmentIds).toEqual([]);
  });

  it("preserves the trailer dimensions and model", () => {
    expect(trailerConfiguration.measuredInteriorFloorCm).toEqual({
      length: 360,
      width: 200,
    });
    expect(trailerConfiguration.modelPath).toBe("/configurator-models/trailer/Anhaenger_v2.glb");
  });
});
