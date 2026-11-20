import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";

export const salesHatchFrontPanelGeometry = {
  minX: -1.78,
  maxX: 1.78,
  gasGriddleCutoutHalfWidth: 0.365,
  height: 0.535,
  depth: 0.02,
  centerY: 0.5425,
  centerZ: 0.99,
  gasGriddleCenterZ: 0.955,
};

export function createSalesHatchFrontPanel() {
  const panel = new Group();
  panel.name = "ASEA_SalesHatchFrontPanel";

  const material = new MeshStandardMaterial({
    color: 0x777a75,
    roughness: 0.52,
    metalness: 0.55,
  });

  const sections = [
    [salesHatchFrontPanelGeometry.minX, -salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth, salesHatchFrontPanelGeometry.centerZ],
    [-salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth, salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth, salesHatchFrontPanelGeometry.gasGriddleCenterZ],
    [salesHatchFrontPanelGeometry.gasGriddleCutoutHalfWidth, salesHatchFrontPanelGeometry.maxX, salesHatchFrontPanelGeometry.centerZ],
  ] as const;

  sections.forEach(([startX, endX, centerZ], index) => {
    const mesh = new Mesh(
      new BoxGeometry(
        endX - startX,
        salesHatchFrontPanelGeometry.height,
        salesHatchFrontPanelGeometry.depth,
      ),
      material,
    );
    mesh.name = `ASEA_SalesHatchFrontPanel_Mesh_${index + 1}`;
    mesh.position.set(
      (startX + endX) / 2,
      salesHatchFrontPanelGeometry.centerY,
      centerZ,
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    panel.add(mesh);
  });

  return panel;
}
