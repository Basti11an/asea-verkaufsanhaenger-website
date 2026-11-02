import { describe, expect, it } from "vitest";
import { createDefaultEquipmentConfiguration } from "./equipmentConfiguration";
import { getConfigurationRows, getCountertopIntervals } from "./configurationSummary";

describe("configuration summary", () => {
  const state = createDefaultEquipmentConfiguration();

  it("derives the actual free work surfaces from the same equipment state", () => {
    expect(getCountertopIntervals(state, "sales-hatch")).toEqual([
      { startCm: 0, endCm: 141.5 },
      { startCm: 218.5, endCm: 360 },
    ]);
    expect(getCountertopIntervals(state, "closed-wall")).toEqual([
      { startCm: 130.5, endCm: 195 },
      { startCm: 295, endCm: 360 },
    ]);
  });

  it("includes actual widths, positions and the fixed gas cabinet", () => {
    const rearRows = getConfigurationRows(state, "closed-wall");
    expect(rearRows).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Gasschrank", widthCm: 71, centerCm: 35.5, note: "fix, hinten links" }),
      expect.objectContaining({ name: "Doppelfritteuse", widthCm: 60, centerCm: 100.5 }),
      expect.objectContaining({ name: "Hygienepaket", widthCm: 100, centerCm: 245 }),
      expect.objectContaining({ name: "Kühlschrank Unterbau", widthCm: 60, centerCm: 330 }),
    ]));
  });
});
