import { describe, expect, it } from "vitest";
import { sidebarEquipmentIds, standardEquipment, trailerConfiguration } from "./defaultConfiguration";

describe("default configurator configuration", () => {
  it("contains the complete standard equipment from the plan", () => {
    expect(standardEquipment).toHaveLength(8);
    expect(sidebarEquipmentIds).toHaveLength(8);
    expect(sidebarEquipmentIds).not.toContain("standard-splash-guard");
    expect(sidebarEquipmentIds).not.toContain("standard-hood");
    expect(sidebarEquipmentIds).toContain("standard-wall-cabinet");
    expect(standardEquipment.every((item) => item.placementStatus === "confirmed")).toBe(true);
  });

  it("preserves the trailer dimensions and references the delivered web model", () => {
    expect(trailerConfiguration.measuredInteriorFloorCm).toEqual({
      length: 360,
      width: 200,
    });
    expect(trailerConfiguration.modelPath).toBe("/configurator-models/trailer/Anhaenger_v2.glb");
    expect(trailerConfiguration.sourceModelPath).toBeNull();
  });

  it("uses the exact wheel-arch dimensions on both sides", () => {
    expect(trailerConfiguration.wheelArchesFromModelCm).toEqual([
      { longitudinalStart: 142.5, longitudinalEnd: 217.5, depthStart: 0, depthEnd: 27, heightEnd: 27.5 },
      { longitudinalStart: 142.5, longitudinalEnd: 217.5, depthStart: 173, depthEnd: 200, heightEnd: 27.5 },
    ]);
    trailerConfiguration.wheelArchesFromModelCm.forEach((wheelArch) => {
      expect(wheelArch.longitudinalEnd - wheelArch.longitudinalStart).toBe(75);
      expect(wheelArch.depthEnd - wheelArch.depthStart).toBe(27);
    });
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
    expect(gasGriddles?.name[0]).toBe("Gasbräter");
  });

  it("fits the undercounter fridge below the rear work surface", () => {
    const fridge = standardEquipment.find((item) => item.id === "standard-undercounter-fridge");

    expect(fridge?.positionCm).toEqual({ longitudinal: 300, height: 0, depth: 0 });
    expect(fridge?.dimensionsCm).toMatchObject({ width: 60, height: 81, depth: 60 });
  });

  it("defines the independent one-metre wall cabinet at the former hygiene-cabinet position", () => {
    const cabinet = standardEquipment.find((item) => item.id === "standard-wall-cabinet");

    expect(cabinet).toMatchObject({
      productId: "wall-cabinet",
      name: ["Hängeschrank", "Wall cabinet", "Závesná skrinka"],
      positionCm: { longitudinal: 195, height: 145, depth: 0 },
      planFootprintCm: { longitudinalStart: 195, longitudinalEnd: 295, depthStart: 0, depthEnd: 40 },
    });
  });
});
