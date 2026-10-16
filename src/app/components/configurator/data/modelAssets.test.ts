import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function collectModelFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);
    return entry.isDirectory() ? collectModelFiles(entryPath) : [entryPath];
  }).filter((file) => /\.(?:blend|glb)$/i.test(file));
}

describe("configurator model reset", () => {
  it("contains no legacy source or browser models", () => {
    expect(collectModelFiles(resolve("3d-source"))).toEqual([]);
    expect(collectModelFiles(resolve("public/configurator-models"))).toEqual([]);
  });

  it("keeps the empty source and export directories ready for the rebuild", () => {
    [
      "3d-source/interieur/.gitkeep",
      "3d-source/trailer/.gitkeep",
      "public/configurator-models/interieur/.gitkeep",
      "public/configurator-models/trailer/.gitkeep",
    ].forEach((path) => expect(existsSync(resolve(path)), `${path} is missing`).toBe(true));
  });
});
