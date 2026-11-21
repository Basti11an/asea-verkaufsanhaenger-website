import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function collectFiles(directory: string, pattern: RegExp): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath, pattern) : [entryPath];
  }).filter((file) => pattern.test(file));
}

function readGlbJson(file: string) {
  const data = readFileSync(resolve(file));
  expect(data.toString("ascii", 0, 4), `${file} is not a GLB file`).toBe("glTF");
  expect(data.readUInt32LE(16), `${file} has no JSON chunk`).toBe(0x4e4f534a);
  const jsonLength = data.readUInt32LE(12);
  return JSON.parse(data.toString("utf8", 20, 20 + jsonLength).trim());
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
  "public/configurator-models/trailer/Anhaenger_v2.glb",
  "public/configurator-models/interieur/arbeitsflaechen/Arbeitsplatten_Staender.glb",
  "public/configurator-models/interieur/hygiene/Doppelwaschbecken.glb",
  "public/configurator-models/interieur/hygiene/Hygienebereich.glb",
  "public/configurator-models/interieur/kochen/Doppelfriteuse.glb",
  "public/configurator-models/interieur/kochen/Friteuse.glb",
  "public/configurator-models/interieur/kochen/Gasbraeter.glb",
  "public/configurator-models/interieur/kochen/Glasnische_Gasbraeter.glb",
  "public/configurator-models/interieur/kochen/Griddleplatte_Elektro.glb",
  "public/configurator-models/interieur/kochen/Induktionskocher.glb",
  "public/configurator-models/interieur/kochen/Kontaktgrill.glb",
  "public/configurator-models/interieur/kochen/Kebapspiess.glb",
  "public/configurator-models/interieur/kuehlung/Flaschenkuehlschrank_gross.glb",
  "public/configurator-models/interieur/kuehlung/Kuehlaufsatz.glb",
  "public/configurator-models/interieur/kuehlung/Kuehlschrank_Unterbau.glb",
  "public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb",
  "public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_Flachhauben_mit_Kaminhaube.glb",
  "public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_Wandhauben.glb",
  "public/configurator-models/interieur/lueftung-und-schutz/Spritzschutz_700.glb",
  "public/configurator-models/interieur/moebel/Arbeitstisch_1200.glb",
  "public/configurator-models/interieur/moebel/Gasschrank.glb",
  "public/configurator-models/interieur/moebel/Haengeschrank.glb",
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

  it("contains every model variant selected by the configurator", () => {
    const selections = [
      ["public/configurator-models/interieur/kochen/Friteuse.glb", "Fritteuse_IMBISS_I"],
      ["public/configurator-models/interieur/kochen/Doppelfriteuse.glb", "Fritteuse_IMBISS_II"],
      ["public/configurator-models/interieur/kochen/Gasbraeter.glb", "Gasbraeter_gross_3fl"],
      ["public/configurator-models/interieur/kochen/Griddleplatte_Elektro.glb", "Griddleplatte_Elektro_660x580x310_glatt"],
      ["public/configurator-models/interieur/hygiene/Doppelwaschbecken.glb", "Doppelwaschbecken_1000x600x850"],
      ["public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb", "Dunstabzug_Flachhaube_600x700x220"],
      ["public/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb", "Dunstabzug_Flachhaube_1000x700x220"],
      ["public/configurator-models/interieur/moebel/Arbeitstisch_1200.glb", "Arbeitstisch_1200x600x850"],
      ["public/configurator-models/interieur/moebel/Haengeschrank.glb", "Haengeschrank_1000x400x660"],
    ] as const;

    selections.forEach(([file, nodeName]) => {
      const glb = readGlbJson(file);
      const nodeNames = (glb.nodes ?? []).map((node: { name?: string }) => node.name);
      expect(nodeNames, `${nodeName} is missing from ${file}`).toContain(nodeName);
    });
  });

  it("keeps the configurator floor texture available", () => {
    const texturePath = resolve("public/configurator-textures/floor/grey-oak-vinyl.png");

    expect(existsSync(texturePath), "configurator floor texture is missing").toBe(true);
    expect(statSync(texturePath).size).toBeGreaterThan(1024);
  });
});
