import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { standardEquipment, trailerConfiguration } from "./defaultConfiguration";
import { products } from "./products";

function resolvePublicModel(modelPath: string) {
  return resolve("public", modelPath.replace(/^\//, ""));
}

describe("published configurator models", () => {
  it("publishes the selected trailer as an unchanged copy of its source GLB", () => {
    const source = readFileSync(resolve(trailerConfiguration.sourceModelPath));
    const published = readFileSync(resolvePublicModel(trailerConfiguration.modelPath));
    expect(published.equals(source)).toBe(true);
  });

  it("keeps every active product model available to the browser", () => {
    products.filter((product) => product.active).forEach((product) => {
      expect(product.modelPath, `${product.id} has no published model path`).not.toBeNull();
      expect(existsSync(resolve(product.sourceModelPath)), `${product.id} source GLB is missing`).toBe(true);
      expect(existsSync(resolvePublicModel(product.modelPath!)), `${product.id} public GLB is missing`).toBe(true);
    });
  });

  it("publishes every product GLB byte-identically to its source export", () => {
    products.filter((product) => product.modelPath).forEach((product) => {
      const source = readFileSync(resolve(product.sourceModelPath));
      const published = readFileSync(resolvePublicModel(product.modelPath!));
      expect(published.equals(source), `${product.id} public GLB differs from its source`).toBe(true);
    });
  });

  it("does not reference missing standard-equipment GLBs", () => {
    standardEquipment.filter((item) => item.modelPath).forEach((item) => {
      expect(existsSync(resolvePublicModel(item.modelPath!)), `${item.id} public GLB is missing`).toBe(true);
    });
  });
});
