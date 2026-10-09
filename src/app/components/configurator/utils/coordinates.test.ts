import { describe, expect, it } from "vitest";
import { trailerConfiguration } from "../data/defaultConfiguration";
import { centimetersToMeters, configurationToWorld, glbRawToConfiguration } from "./coordinates";

describe("configurator coordinates", () => {
  it("converts centimeters to world meters without rounding", () => {
    expect(centimetersToMeters(33)).toBe(0.33);
  });

  it("maps the center of the 360 by 200 cm floor to the world origin", () => {
    expect(configurationToWorld({ longitudinal: 180, height: 0, depth: 100 })).toEqual([0, 0, 0]);
  });

  it("uses the configured model origin for the front closed-wall corner", () => {
    expect(configurationToWorld({ longitudinal: 0, height: 0, depth: 0 })).toEqual(
      [...trailerConfiguration.modelPosition],
    );
  });

  it("maps Blender raw units into the documented configuration axes", () => {
    expect(glbRawToConfiguration([18, 2.5, -10])).toEqual({
      longitudinal: 180,
      height: 25,
      depth: 100,
    });
  });
});
