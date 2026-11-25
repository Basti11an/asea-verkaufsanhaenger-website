import {
  DataTexture,
  Group,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
  type Texture,
} from "three";

export type WorktopMaterial = "gray" | "stainless";

const worktopSurfaceTag = "aseaWorktopSurface";

const grayAppearance = {
  color: 0x777a75,
  metalness: 0.55,
  roughness: 0.52,
  envMapIntensity: 1,
} as const;

const stainlessAppearance = {
  color: 0xb9bcb8,
  metalness: 0.86,
  roughness: 0.55,
  envMapIntensity: 0.82,
} as const;

export function createWorktopSurfaceMaterial() {
  const material = new MeshStandardMaterial(grayAppearance);
  material.userData[worktopSurfaceTag] = true;
  return material;
}

export function createBrushedSteelRoughnessMap() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    const broadGrain = Math.sin(y * 0.82) * 5;
    for (let x = 0; x < size; x += 1) {
      const fineGrain = Math.sin(y * 3.7 + x * 0.11) * 2;
      const value = Math.round(214 + broadGrain + fineGrain);
      const index = (y * size + x) * 4;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }

  const texture = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 18);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function applyWorktopMaterial(
  root: Group,
  selection: WorktopMaterial,
  brushedSteelRoughnessMap: Texture,
) {
  const appearance = selection === "stainless" ? stainlessAppearance : grayAppearance;
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial) || material.userData[worktopSurfaceTag] !== true) return;
      material.color.setHex(appearance.color);
      material.metalness = appearance.metalness;
      material.roughness = appearance.roughness;
      material.envMapIntensity = appearance.envMapIntensity;
      material.roughnessMap = selection === "stainless" ? brushedSteelRoughnessMap : null;
      material.needsUpdate = true;
    });
  });
}

export const worktopMaterialValues = {
  gray: grayAppearance,
  stainless: stainlessAppearance,
} as const;
