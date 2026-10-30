import { existsSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function collectFiles(directory: string, pattern: RegExp): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath, pattern) : [entryPath];
  }).filter((file) => pattern.test(file));
}

const expectedSourceModels = [
  "3d-source/interieur/arbeitsflaechen/Arbeitsplatten.blend",
  "3d-source/interieur/arbeitsflaechen/Arbeitsplatten_Staender.blend",
  "3d-source/interieur/hygiene/Doppelwaschbecken.blend",
  "3d-source/interieur/hygiene/Hygienebereich.blend",
  "3d-source/interieur/kochen/Doppelfriteuse.blend",
  "3d-source/interieur/kochen/Friteuse.blend",
  "3d-source/interieur/kochen/Gasbraeter.blend",
  "3d-source/interieur/kochen/Glasnische_Gasbraeter.blend",
  "3d-source/interieur/kochen/Griddleplatte_Elektro.blend",
  "3d-source/interieur/kochen/Induktionskocher.blend",
  "3d-source/interieur/kochen/Kontaktgrill.blend",
  "3d-source/interieur/kuehlung/Flaschenkuehlschrank_gross.blend",
  "3d-source/interieur/kuehlung/Kuehlaufsatz.blend",
  "3d-source/interieur/kuehlung/Kuehlschrank_Unterbau.blend",
  "3d-source/interieur/lueftung-und-schutz/Dunstabzug.blend",
  "3d-source/interieur/lueftung-und-schutz/Spritzschutz.blend",
  "3d-source/interieur/moebel/Arbeitstisch.blend",
  "3d-source/interieur/moebel/Gasschrank.blend",
  "3d-source/interieur/moebel/Haengeschrank.blend",
];

const expectedWebModels = [
  "public/configurator-models/interieur/arbeitsflaechen/Arbeitsplatten_Staender.glb",
  "public/configurator-models/interieur/hygiene/Hygienebereich.glb",
  "public/configurator-models/interieur/kochen/Doppelfriteuse.glb",
  "public/configurator-models/interieur/kochen/Gasbraeter.glb",
  "public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb",
  "public/configurator-models/interieur/moebel/Arbeitstisch_1200.glb",
  "public/configurator-models/interieur/moebel/Gasschrank.glb",
];

describe("configurator model structure", () => {
  it("contains the complete, categorized Blender source set", () => {
    const sourceModels = collectFiles(resolve("3d-source"), /\.blend$/i)
      .map((file) => relative(resolve("."), file).replaceAll("\\", "/"))
      .sort();

    expect(sourceModels).toEqual([...expectedSourceModels].sort());
  });

  it("contains only the required browser exports and rejects Blender backup files", () => {
    const webModels = collectFiles(resolve("public/configurator-models"), /\.(?:blend|glb)$/i)
      .map((file) => relative(resolve("."), file).replaceAll("\\", "/"))
      .sort();

    expect(webModels).toEqual([...expectedWebModels].sort());
    webModels.forEach((file) => {
      expect(statSync(resolve(file)).size, `${file} is unexpectedly small`).toBeGreaterThan(1024);
    });
    expect(collectFiles(resolve("."), /\.blend(?:1|2|@)$/i)).toEqual([]);
  });

  it("keeps categorized export directories ready for future GLB files", () => {
    [
      "3d-source/trailer/.gitkeep",
      "public/configurator-models/trailer/.gitkeep",
      "public/configurator-models/interieur/arbeitsflaechen/.gitkeep",
      "public/configurator-models/interieur/hygiene/.gitkeep",
      "public/configurator-models/interieur/kochen/.gitkeep",
      "public/configurator-models/interieur/kuehlung/.gitkeep",
      "public/configurator-models/interieur/lueftung-und-schutz/.gitkeep",
      "public/configurator-models/interieur/moebel/.gitkeep",
    ].forEach((path) => expect(existsSync(resolve(path)), `${path} is missing`).toBe(true));
  });
});
