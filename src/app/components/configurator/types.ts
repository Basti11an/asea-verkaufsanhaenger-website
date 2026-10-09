export type LocalizedText = readonly [string, string, string];

export type ConfiguratorView = "three" | "top" | "front" | "rear";

export type ProductCategory = "cooking" | "cooling" | "hygiene" | "furniture";

export type PositionCm = {
  longitudinal: number;
  height: number;
  depth: number;
};

export type FootprintCm = {
  longitudinalStart: number;
  longitudinalEnd: number;
  depthStart: number;
  depthEnd: number;
};

export type DimensionsCm = {
  width: number;
  height: number;
  depth: number;
};

export type ProductDefinition = {
  id: string;
  name: LocalizedText;
  category: ProductCategory;
  preferredView: ConfiguratorView;
  modelPath: string | null;
  sourceModelPath: string;
  sceneNodeName: string | null;
  dimensionsCm: DimensionsCm | null;
  measuredGlbBoundsCm: DimensionsCm | null;
  defaultSide: string | null;
  defaultPositionCm: PositionCm | null;
  defaultRotationDeg: number | null;
  fixed: boolean | null;
  removable: boolean | null;
  active: boolean;
  rules: {
    allowedSides: readonly string[];
    blockedAreas: readonly string[];
    wheelArchAllowed: boolean | null;
    countertopBehavior: string | null;
    dependencies: readonly string[];
    conflicts: readonly string[];
  };
};

export type StandardEquipmentDefinition = {
  id: string;
  productId: string | null;
  name: LocalizedText;
  modelPath: string | null;
  sceneNodeName: string | null;
  dimensionsCm: DimensionsCm | null;
  measuredGlbBoundsCm: DimensionsCm | null;
  planFootprintCm: FootprintCm | null;
  unresolvedPlanValues: readonly string[];
  material: string | null;
  positionCm: PositionCm | null;
  rotationDeg: number | null;
  side: string | null;
  fixed: boolean | null;
  removable: boolean | null;
  placementStatus: "confirmed" | "awaiting-plan-value" | "blocked-model-mismatch" | "missing-model";
};

export type CameraPresetDefinition = {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  up: readonly [number, number, number];
  fov: number;
};
