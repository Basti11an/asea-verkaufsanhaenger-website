import { Box3, Mesh } from "three";
import { describe, expect, it } from "vitest";
import { createSalesHatchFrontPanel, salesHatchFrontPanelGeometry } from "./SalesHatchFrontPanel";

describe("sales hatch front panel", () => {
  it("closes the lower hatch without protruding into or outside the trailer", () => {
    const panel = createSalesHatchFrontPanel();
    panel.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(panel);

    expect(bounds.min.x).toBeCloseTo(-1.78);
    expect(bounds.max.x).toBeCloseTo(1.78);
    expect(bounds.min.y).toBeCloseTo(0.275);
    expect(bounds.max.y).toBeCloseTo(0.81);
    expect(bounds.min.z).toBeCloseTo(
      salesHatchFrontPanelGeometry.gasGriddleCenterZ - salesHatchFrontPanelGeometry.depth / 2,
    );
    expect(bounds.max.z).toBeCloseTo(1);
  });

  it("closes the gas-griddle area on a separate recessed plane", () => {
    const panel = createSalesHatchFrontPanel();
    const meshes = panel.children.filter((child): child is Mesh => child instanceof Mesh);

    expect(meshes).toHaveLength(3);
    const [leftBounds, centerBounds, rightBounds] = meshes.map((mesh) => new Box3().setFromObject(mesh));
    expect(leftBounds.max.x).toBeCloseTo(-salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth);
    expect(centerBounds.min.x).toBeCloseTo(-salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth);
    expect(centerBounds.max.x).toBeCloseTo(salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth);
    expect(rightBounds.min.x).toBeCloseTo(salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth);
    expect(centerBounds.max.z).toBeLessThan(leftBounds.min.z);
  });
});
