import { Group, Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { describe, expect, it } from "vitest";
import { selectModelVariant } from "./ModelLoader";

describe("selectModelVariant", () => {
  it("keeps the complete scene when no variant is configured", () => {
    const scene = new Group();
    expect(selectModelVariant(scene, null)).toBe(scene);
  });

  it("isolates a named model group with all of its children", () => {
    const scene = new Group();
    const selected = new Group();
    selected.name = "selected-model";
    selected.position.set(12, 0, -4);
    selected.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial()));
    const other = new Group();
    other.name = "other-model";
    scene.add(selected, other);

    const result = selectModelVariant(scene, "selected-model");

    expect(result.getObjectByName("selected-model")).toBe(selected);
    expect(result.getObjectByName("other-model")).toBeUndefined();
    expect(selected.children).toHaveLength(1);
    expect(selected.position.toArray()).toEqual([0, 0, 0]);
  });

  it("fails explicitly when a configured variant does not exist", () => {
    expect(() => selectModelVariant(new Group(), "missing-model")).toThrow(
      "Model node not found: missing-model",
    );
  });
});
