import { Box3, Mesh } from "three";
import { describe, expect, it } from "vitest";
import { createSalesHatchFrontPanel } from "./SalesHatchFrontPanel";

describe("sales hatch front panel", () => {
  it("closes the lower hatch without protruding into or outside the trailer", () => {
    const panel = createSalesHatchFrontPanel();
    panel.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(panel);

    expect(bounds.min.x).toBeCloseTo(-1.78);
    expect(bounds.max.x).toBeCloseTo(1.78);
    expect(bounds.min.y).toBeCloseTo(0.275);
    expect(bounds.max.y).toBeCloseTo(0.81);
    expect(bounds.min.z).toBeCloseTo(0.98);
    expect(bounds.max.z).toBeCloseTo(1);
  });

  it("uses one continuous panel without seams", () => {
    const panel = createSalesHatchFrontPanel();
    const meshes = panel.children.filter((child): child is Mesh => child instanceof Mesh);

    expect(meshes).toHaveLength(1);
    expect(meshes[0].name).toBe("ASEA_SalesHatchFrontPanel_Mesh");
  });
});
