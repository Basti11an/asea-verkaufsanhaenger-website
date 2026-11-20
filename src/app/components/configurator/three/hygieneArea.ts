import type { Group } from "three";

export const hygieneWallCabinetNodeName = "Haengeschrank_1000x400x660";

export function removeHygieneWallCabinet(model: Group) {
  model.getObjectByName(hygieneWallCabinetNodeName)?.removeFromParent();
  return model;
}
