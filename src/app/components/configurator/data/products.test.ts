import { describe, expect, it } from "vitest";
import { productById, products } from "./products";

describe("configurator products", () => {
  it("uses the measured bounds of the selected model variants", () => {
    expect(productById.get("gas-griddle")?.measuredGlbBoundsCm).toEqual({ width: 66.05, height: 25, depth: 62.5 });
    expect(productById.get("electric-griddle")?.measuredGlbBoundsCm).toEqual({ width: 66.04, height: 31, depth: 64 });
    expect(productById.get("induction")?.measuredGlbBoundsCm).toEqual({ width: 32.97, height: 10.53, depth: 46.99 });
    expect(productById.get("double-sink")?.measuredGlbBoundsCm).toEqual({ width: 100, height: 136, depth: 62.4 });
    expect(productById.get("worktable")?.measuredGlbBoundsCm).toEqual({ width: 120, height: 85, depth: 60 });
    expect(productById.get("wall-cabinet")?.measuredGlbBoundsCm).toEqual({ width: 100, height: 66, depth: 40.05 });
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

  it("offers fryer and extractor hood as one selectable product", () => {
    expect(productById.get("double-fryer")).toMatchObject({
      active: true,
      name: [
        "Doppelfritteuse mit Dunstabzug",
        "Double fryer with extractor hood",
        "Dvojitá fritéza s odsávačom pár",
      ],
    });
    expect(productById.get("extractor-hood")?.active).toBe(false);
  });
});
