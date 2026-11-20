import { Group, Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { describe, expect, it } from "vitest";
import { hygieneWallCabinetNodeName, removeHygieneWallCabinet } from "./hygieneArea";

describe("hygiene area composition", () => {
  it("removes only the legacy wall cabinet from the hygiene package", () => {
    const hygieneArea = new Group();
    const cabinet = new Group();
    cabinet.name = hygieneWallCabinetNodeName;
    cabinet.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial()));
    const sink = new Group();
    sink.name = "Spueltisch_Doppelbecken_1000x600x850";
    hygieneArea.add(cabinet, sink);

    removeHygieneWallCabinet(hygieneArea);

    expect(hygieneArea.getObjectByName(hygieneWallCabinetNodeName)).toBeUndefined();
    expect(hygieneArea.getObjectByName("Spueltisch_Doppelbecken_1000x600x850")).toBe(sink);
  });
});
