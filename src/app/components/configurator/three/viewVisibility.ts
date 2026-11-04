import { Mesh } from "three";
import type { Group } from "three";
import { trailerConfiguration } from "../data/defaultConfiguration";
import type { ConfiguratorView } from "../types";

export type ConfiguratorRowGroups = {
  frontRow: Group;
  backRow: Group;
};

const INTERIOR_VIEW_PARTS = new Set([
  "v2_Bodenplatte_Siebdruck",
  "v2_Holzboden",
  "v2_Radkasten_innen_links",
  "v2_Radkasten_innen_rechts",
]);

export function applyConfiguratorViewVisibility(
  model: Group,
  view: ConfiguratorView,
  rowGroups?: ConfiguratorRowGroups,
) {
  const showInteriorOnly = view === "top" || view === "rear";
  model.traverse((object) => {
    if (object instanceof Mesh) {
      object.visible = !showInteriorOnly || INTERIOR_VIEW_PARTS.has(object.name);
    }
  });

  const outerShell = model.getObjectByName(trailerConfiguration.sceneNodes.outerShell);
  const showOuterShell = view !== "top" && view !== "rear";
  if (outerShell) outerShell.visible = showOuterShell;

  const sellingFlap = model.getObjectByName(trailerConfiguration.sceneNodes.sellingFlapPivot);
  if (sellingFlap) sellingFlap.visible = showOuterShell;

  trailerConfiguration.sceneNodes.roof.forEach((name) => {
    const object = model.getObjectByName(name);
    if (object) object.visible = view !== "top";
  });

  if (rowGroups) {
    rowGroups.frontRow.visible = view !== "front";
    rowGroups.backRow.visible = view !== "rear";
  }
}
