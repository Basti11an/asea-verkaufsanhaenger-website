import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";

export const salesHatchFrontPanelGeometry = {
  width: 3.56,
  height: 0.535,
  depth: 0.02,
  center: [0, 0.5425, 0.99] as const,
};

export function createSalesHatchFrontPanel() {
  const panel = new Group();
  panel.name = "ASEA_SalesHatchFrontPanel";

  const material = new MeshStandardMaterial({
    color: 0x777a75,
    roughness: 0.52,
    metalness: 0.55,
  });

  const mesh = new Mesh(
    new BoxGeometry(
      salesHatchFrontPanelGeometry.width,
      salesHatchFrontPanelGeometry.height,
      salesHatchFrontPanelGeometry.depth,
    ),
    material,
  );
  mesh.name = "ASEA_SalesHatchFrontPanel_Mesh";
  mesh.position.set(...salesHatchFrontPanelGeometry.center);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  panel.add(mesh);

  return panel;
}
