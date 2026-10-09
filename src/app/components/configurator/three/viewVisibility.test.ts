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

  it("keeps the trailer shell visible in the rear view", () => {
    const model = new Group();
    const outerShell = new Group();
    outerShell.name = trailerConfiguration.sceneNodes.outerShell;
    model.add(outerShell);

    applyConfiguratorViewVisibility(model, "rear");
    expect(outerShell.visible).toBe(true);

    applyConfiguratorViewVisibility(model, "three");
    expect(outerShell.visible).toBe(true);
  });

  it("shows only the back row in the front view and restores both rows", () => {
    const model = new Group();
    const rows = { frontRow: new Group(), backRow: new Group() };

    applyConfiguratorViewVisibility(model, "front", rows);
    expect(rows.frontRow.visible).toBe(false);
    expect(rows.backRow.visible).toBe(true);

    applyConfiguratorViewVisibility(model, "three", rows);
    expect(rows.frontRow.visible).toBe(true);
    expect(rows.backRow.visible).toBe(true);
  });

  it("shows only the front row in the rear view", () => {
    const rows = { frontRow: new Group(), backRow: new Group() };

    applyConfiguratorViewVisibility(new Group(), "rear", rows);

    expect(rows.frontRow.visible).toBe(true);
    expect(rows.backRow.visible).toBe(false);
  });
});
