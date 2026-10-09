import { describe, expect, it } from "vitest";
import { productById, products } from "./products";

const productsWithUnselectedVariants = [
  "gas-griddle",
  "electric-griddle",
  "induction",
  "double-sink",
  "worktable",
  "wall-cabinet",
  "extractor-hood",
] as const;

describe("configurator products", () => {
  it("does not expose packed-scene bounds as individual product dimensions", () => {
    productsWithUnselectedVariants.forEach((id) => {
      const product = productById.get(id);
      expect(product?.sceneNodeName).toBeNull();
      expect(product?.measuredGlbBoundsCm).toBeNull();
    });
  });

  it("isolates the single fryer from unrelated loose scene nodes", () => {
    expect(productById.get("fryer")).toMatchObject({
      sceneNodeName: "Fritteuse_IMBISS_I",
      measuredGlbBoundsCm: { width: 29.1, height: 41.1, depth: 71.3 },
    });
  });

  it("gives each product its own future rule containers", () => {
    expect(products[0].rules).not.toBe(products[1].rules);
    expect(products[0].rules.allowedSides).not.toBe(products[1].rules.allowedSides);
  });
});
