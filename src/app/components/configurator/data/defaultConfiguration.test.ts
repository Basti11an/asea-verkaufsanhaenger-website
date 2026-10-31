import { describe, expect, it } from "vitest";
import { sidebarEquipmentIds, standardEquipment, trailerConfiguration } from "./defaultConfiguration";

describe("default configurator configuration", () => {
  it("contains the complete standard equipment from the plan", () => {
    expect(sidebarEquipmentIds).toHaveLength(9);
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

  it("places the double fryer top flush with the 85 cm work surface", () => {
    const fryer = standardEquipment.find((item) => item.id === "standard-double-fryer");
    const scaledHeight = 41.05 * (59 / 58.05);

    expect((fryer?.positionCm?.height ?? 0) + scaledHeight).toBeCloseTo(85, 1);
  });

  it("aligns the gas griddles with the seller-side countertop edge", () => {
    const gasGriddles = standardEquipment.find((item) => item.id === "standard-gas-griddles");

    expect(gasGriddles?.positionCm?.depth).toBe(140);
    expect((gasGriddles?.positionCm?.height ?? 0) + (gasGriddles?.dimensionsCm?.height ?? 0)).toBe(85);
    expect(gasGriddles?.planFootprintCm).toMatchObject({ depthStart: 140, depthEnd: 200 });
  });

  it("fits the undercounter fridge below the rear work surface", () => {
    const fridge = standardEquipment.find((item) => item.id === "standard-undercounter-fridge");

    expect(fridge?.positionCm).toEqual({ longitudinal: 300, height: 0, depth: 0 });
    expect(fridge?.dimensionsCm).toMatchObject({ width: 60, height: 81, depth: 60 });
  });
});
