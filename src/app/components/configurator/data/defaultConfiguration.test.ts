import { describe, expect, it } from "vitest";
import { sidebarEquipmentIds, standardEquipment, trailerConfiguration } from "./defaultConfiguration";

describe("default configurator configuration", () => {
  it("contains the complete standard equipment from the plan", () => {
    expect(sidebarEquipmentIds).toHaveLength(7);
    expect(standardEquipment.map((item) => item.id)).toEqual(sidebarEquipmentIds);
    expect(standardEquipment.every((item) => item.placementStatus === "confirmed")).toBe(true);
  });

  it("preserves the trailer dimensions without referencing the deleted trailer model", () => {
    expect(trailerConfiguration.measuredInteriorFloorCm).toEqual({
      length: 360,
      width: 200,
    });
    expect(trailerConfiguration.modelPath).toBeNull();
    expect(trailerConfiguration.sourceModelPath).toBeNull();
  });

  it("keeps the closed-wall equipment in the plan order", () => {
    expect(trailerConfiguration.planLayoutCm.closedWallRow.segments).toEqual([
      { id: "gas-cabinet", longitudinalStart: 0, longitudinalEnd: 71 },
      { id: "double-fryer", longitudinalStart: 71, longitudinalEnd: 130 },
      { id: "countertop", longitudinalStart: 130, longitudinalEnd: 195 },
      { id: "hygiene-area", longitudinalStart: 195, longitudinalEnd: 295 },
      { id: "countertop", longitudinalStart: 295, longitudinalEnd: 360 },
    ]);
  });
});
