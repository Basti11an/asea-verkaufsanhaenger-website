import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { describe, expect, it } from "vitest";
import {
  applyWorktopMaterial,
  createBrushedSteelRoughnessMap,
  createWorktopSurfaceMaterial,
  worktopMaterialValues,
} from "./worktopMaterials";

describe("worktop materials", () => {
  it("uses the existing gray appearance as its exact default", () => {
    const material = createWorktopSurfaceMaterial();
    expect(material.color.getHex()).toBe(worktopMaterialValues.gray.color);
    expect(material.metalness).toBe(worktopMaterialValues.gray.metalness);
    expect(material.roughness).toBe(worktopMaterialValues.gray.roughness);
    expect(material.roughnessMap).toBeNull();
  });

  it("changes only tagged worktop surfaces and restores gray exactly", () => {
    const root = new Group();
    const worktop = createWorktopSurfaceMaterial();
    const unrelated = new MeshStandardMaterial({ color: 0x777a75, metalness: 0.1, roughness: 0.8 });
    root.add(new Mesh(new BoxGeometry(1, 1, 1), worktop));
    root.add(new Mesh(new BoxGeometry(1, 1, 1), unrelated));
    const brushedMap = createBrushedSteelRoughnessMap();

    applyWorktopMaterial(root, "stainless", brushedMap);
    expect(worktop.color.getHex()).toBe(worktopMaterialValues.stainless.color);
    expect(worktop.metalness).toBe(worktopMaterialValues.stainless.metalness);
    expect(worktop.roughnessMap).toBe(brushedMap);
    expect(unrelated.color.getHex()).toBe(0x777a75);
    expect(unrelated.metalness).toBe(0.1);

    applyWorktopMaterial(root, "gray", brushedMap);
    expect(worktop.color.getHex()).toBe(worktopMaterialValues.gray.color);
    expect(worktop.metalness).toBe(worktopMaterialValues.gray.metalness);
    expect(worktop.roughness).toBe(worktopMaterialValues.gray.roughness);
    expect(worktop.roughnessMap).toBeNull();
    brushedMap.dispose();
  });
});
