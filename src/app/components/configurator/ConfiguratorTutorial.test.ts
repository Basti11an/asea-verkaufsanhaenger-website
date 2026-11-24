import { describe, expect, it } from "vitest";
import { tutorialSteps } from "./tutorialSteps";

describe("configurator tutorial", () => {
  it("contains exactly the eight requested steps in order", () => {
    expect(tutorialSteps).toHaveLength(8);
    expect(tutorialSteps.map((step) => step.target)).toEqual([
      "viewport",
      "view-switcher",
      "categories",
      "product-list",
      "product-editor",
      "position-slider",
      "equipment-list",
      "finish",
    ]);
  });

  it("falls back to the equipment area when no product editor is open", () => {
    expect(tutorialSteps[4].fallbackTarget).toBe("equipment-list");
  });
});
