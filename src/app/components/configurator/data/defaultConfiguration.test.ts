import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { standardEquipment, trailerConfiguration } from "./defaultConfiguration";
import { productById } from "./products";

function readGlbNodeNames(modelPath: string) {
  const file = readFileSync(resolve("public", modelPath.replace(/^\//, "")));
  const jsonChunkLength = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + jsonChunkLength).toString("utf8")) as {
    nodes?: Array<{ name?: string }>;
  };
  return new Set(gltf.nodes?.flatMap((node) => node.name ? [node.name] : []) ?? []);
}

describe("default configurator configuration", () => {
  it("records the model-derived 360 by 200 cm interior floor", () => {
    expect(trailerConfiguration.measuredInteriorFloorCm).toEqual({
      length: 360,
      width: 200,
    });
  });

  it("records the binding plan dimensions and both complete work rows", () => {
    expect(trailerConfiguration.planReference).toEqual({
      status: "available",
      interiorLengthCm: 360,
      interiorWidthCm: 200,
      interiorHeightCm: 230,
    });
    expect(trailerConfiguration.planLayoutCm.closedWallRow.segments).toEqual([
      { id: "gas-cabinet", longitudinalStart: 0, longitudinalEnd: 71 },
      { id: "double-fryer", longitudinalStart: 71, longitudinalEnd: 130 },
      { id: "countertop", longitudinalStart: 130, longitudinalEnd: 195 },
      { id: "hygiene-area", longitudinalStart: 195, longitudinalEnd: 295 },
      { id: "countertop", longitudinalStart: 295, longitudinalEnd: 360 },
    ]);
    expect(trailerConfiguration.planLayoutCm.salesHatchRow.segments).toEqual([
      { id: "countertop", longitudinalStart: 0, longitudinalEnd: 125 },
      { id: "gas-griddle", longitudinalStart: 125, longitudinalEnd: 235, units: 2 },
      { id: "countertop", longitudinalStart: 235, longitudinalEnd: 360 },
    ]);
    expect(trailerConfiguration.planLayoutCm.gasGriddleNiche).toEqual({
      longitudinalStart: 125,
      longitudinalEnd: 235,
      depthStart: 167,
      depthEnd: 200,
    });
    expect(trailerConfiguration.worktopBandsCm).toHaveLength(5);
    expect(trailerConfiguration.worktopBandsCm).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "closed-wall-worktop-middle", longitudinalStart: 130, longitudinalEnd: 195 }),
      expect.objectContaining({ id: "closed-wall-worktop-right", longitudinalStart: 295, longitudinalEnd: 360 }),
      expect.objectContaining({ id: "sales-hatch-worktop-gap-left", longitudinalStart: 120, longitudinalEnd: 125 }),
      expect.objectContaining({ id: "sales-hatch-worktop-gap-right", longitudinalStart: 235, longitudinalEnd: 240 }),
    ]));
  });

  it("confirms positioned equipment and keeps each model in the central data source", () => {
    const confirmed = standardEquipment.filter((item) => item.placementStatus === "confirmed");
    expect(confirmed.map((item) => item.id)).toEqual([
      "standard-double-fryer",
      "standard-extractor-hood",
      "standard-hygiene-area",
      "standard-gas-griddle",
      "standard-worktable-sales-left",
      "standard-worktable-sales-right",
      "fixed-gas-cabinet",
    ]);
    const hygieneArea = confirmed.find((item) => item.id === "standard-hygiene-area");
    expect(hygieneArea?.positionCm).toEqual({ longitudinal: 195, height: 0, depth: 0 });
    expect(hygieneArea?.planFootprintCm).toEqual({
      longitudinalStart: 195,
      longitudinalEnd: 295,
      depthStart: 0,
      depthEnd: 60,
    });
    const extractorHood = confirmed.find((item) => item.id === "standard-extractor-hood");
    expect(extractorHood?.positionCm).toEqual({ longitudinal: 71, height: 142, depth: 0 });
    const doubleFryer = confirmed.find((item) => item.id === "standard-double-fryer");
    expect(doubleFryer?.positionCm).toEqual({ longitudinal: 130, height: 85, depth: 60 });
    expect(doubleFryer?.rotationDeg).toBe(180);
  });

  it("uses the supplied visible gas-griddle variant", () => {
    const gasGriddle = standardEquipment.find((item) => item.id === "standard-gas-griddle");
    expect(gasGriddle?.sceneNodeName).toBe("Gasbraeter_gross_3fl");
    expect(gasGriddle?.measuredGlbBoundsCm).toEqual({ width: 66.05, height: 27.9, depth: 62.5 });
    expect(gasGriddle?.positionCm).toEqual({ longitudinal: 213, height: 57.1, depth: 200 });
    expect(gasGriddle?.rotationDeg).toBe(180);
    expect(gasGriddle?.placementStatus).toBe("confirmed");
  });

  it("keeps meshless countertops explicitly unavailable", () => {
    const countertops = standardEquipment.find((item) => item.id === "standard-countertops");
    expect(countertops?.modelPath).toBeNull();
    expect(countertops?.placementStatus).toBe("missing-model");
    expect(countertops?.material).toBe("stainless-steel");
  });

  it("keeps all standard-equipment identifiers unique", () => {
    const ids = standardEquipment.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("links standard items to known products", () => {
    standardEquipment.forEach((item) => {
      if (item.productId) expect(productById.has(item.productId)).toBe(true);
    });
  });

  it("uses variant node names that exist in the published GLBs", () => {
    standardEquipment.forEach((item) => {
      if (!item.modelPath || !item.sceneNodeName) return;
      expect(readGlbNodeNames(item.modelPath).has(item.sceneNodeName)).toBe(true);
    });
  });
});
