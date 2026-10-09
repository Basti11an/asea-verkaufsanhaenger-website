import type { Group } from "three";
import { trailerConfiguration } from "../data/defaultConfiguration";
import type { ConfiguratorView } from "../types";

export type ConfiguratorRowGroups = {
  frontRow: Group;
  backRow: Group;
};

export function applyConfiguratorViewVisibility(
  model: Group,
  view: ConfiguratorView,
  rowGroups?: ConfiguratorRowGroups,
) {
  const outerShell = model.getObjectByName(trailerConfiguration.sceneNodes.outerShell);
  if (outerShell) outerShell.visible = view !== "top" && view !== "rear";

  trailerConfiguration.sceneNodes.roof.forEach((name) => {
    const object = model.getObjectByName(name);
    if (object) object.visible = view !== "top" && view !== "rear";
  });

  if (rowGroups) {
    rowGroups.frontRow.visible = view !== "front";
    rowGroups.backRow.visible = view !== "rear";
  }
}
