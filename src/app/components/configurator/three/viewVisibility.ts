import type { Group } from "three";
import { trailerConfiguration } from "../data/defaultConfiguration";
import type { ConfiguratorView } from "../types";

export function applyConfiguratorViewVisibility(model: Group, view: ConfiguratorView) {
  const outerShell = model.getObjectByName(trailerConfiguration.sceneNodes.outerShell);
  if (outerShell) outerShell.visible = view !== "top";

  trailerConfiguration.sceneNodes.roof.forEach((name) => {
    const object = model.getObjectByName(name);
    if (object) object.visible = view !== "top";
  });
}
