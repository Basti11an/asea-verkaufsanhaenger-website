import { Group } from "three";
import { describe, expect, it } from "vitest";
import { trailerConfiguration } from "../data/defaultConfiguration";
import { applyConfiguratorViewVisibility } from "./viewVisibility";

describe("configurator view visibility", () => {
  it("hides only the identified outer shell in the top view", () => {
    const model = new Group();
    const outerShell = new Group();
    outerShell.name = trailerConfiguration.sceneNodes.outerShell;
    const unrelatedPart = new Group();
    unrelatedPart.name = "unrelated-part";
    model.add(outerShell, unrelatedPart);

    applyConfiguratorViewVisibility(model, "top");

    expect(outerShell.visible).toBe(false);
    expect(unrelatedPart.visible).toBe(true);
  });

  it("restores the outer shell after leaving the top view", () => {
    const model = new Group();
    const outerShell = new Group();
    outerShell.name = trailerConfiguration.sceneNodes.outerShell;
    model.add(outerShell);

    applyConfiguratorViewVisibility(model, "top");
    applyConfiguratorViewVisibility(model, "three");

    expect(outerShell.visible).toBe(true);
  });
});
