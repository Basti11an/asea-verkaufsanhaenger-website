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

  it("does not invent positions while the binding plan is missing", () => {
    expect(trailerConfiguration.planReference.status).toBe("missing");
    expect(standardEquipment.every((item) => item.positionCm === null)).toBe(true);
    expect(standardEquipment.every((item) => item.placementStatus === "awaiting-plan")).toBe(true);
  });

  it("does not select an unconfirmed gas-griddle variant", () => {
    const gasGriddle = standardEquipment.find((item) => item.id === "standard-gas-griddle");
    expect(gasGriddle?.sceneNodeName).toBeNull();
    expect(gasGriddle?.measuredGlbBoundsCm).toBeNull();
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
