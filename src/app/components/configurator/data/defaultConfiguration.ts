import type { StandardEquipmentDefinition } from "../types";

export const trailerConfiguration = {
  modelPath: "/configurator-models/trailer/Anhaenger_v2.glb",
  sourceModelPath: "3d-source/Anhaenger_v2.glb",
  scale: 0.1,
  rawUnitsPerMeter: 10,
  modelPosition: [-1.8, 0, 1] as const,
  measuredModelBoundsMeters: {
    length: 5.56,
    height: 2.72748375,
    width: 2.127,
  },
  measuredInteriorFloorCm: {
    length: 360,
    width: 200,
  },
  installationReferenceCm: {
    // Independently encoded by the gas cabinet and hygiene-table GLBs.
    standardWorkSurfaceHeight: 85,
  },
  planReference: {
    status: "available" as const,
    interiorLengthCm: 360,
    interiorWidthCm: 200,
    interiorHeightCm: 230,
  },
  planLayoutCm: {
    entrance: {
      longitudinal: 360,
      depthStart: 60,
      depthEnd: 140,
      width: 80,
    },
    closedWallRow: {
      depthStart: 0,
      depthEnd: 60,
      segments: [
        { id: "gas-cabinet", longitudinalStart: 0, longitudinalEnd: 71 },
        { id: "double-fryer", longitudinalStart: 71, longitudinalEnd: 130 },
        { id: "countertop", longitudinalStart: 130, longitudinalEnd: 195 },
        { id: "hygiene-area", longitudinalStart: 195, longitudinalEnd: 295 },
        { id: "countertop", longitudinalStart: 295, longitudinalEnd: 360 },
      ],
    },
    salesHatchRow: {
      depthStart: 140,
      depthEnd: 200,
      segments: [
        { id: "countertop", longitudinalStart: 0, longitudinalEnd: 125 },
        { id: "gas-griddle", longitudinalStart: 125, longitudinalEnd: 235, units: 2 },
        { id: "countertop", longitudinalStart: 235, longitudinalEnd: 360 },
      ],
    },
    gasGriddleNiche: {
      longitudinalStart: 125,
      longitudinalEnd: 235,
      depthStart: 167,
      depthEnd: 200,
    },
  },
  coordinateSystem: {
    origin: "Front corner on the closed wall at interior-floor height",
    longitudinalAxis: "Positive from drawbar/front toward the rear wall",
    verticalAxis: "Positive upward from the interior floor",
    depthAxis: "Positive from the closed wall toward the sales hatch",
    unit: "centimeters" as const,
  },
  wheelArchesFromModelCm: [
    { longitudinalStart: 142, longitudinalEnd: 218, depthStart: 0, depthEnd: 22, heightEnd: 27.5 },
    { longitudinalStart: 142, longitudinalEnd: 218, depthStart: 178, depthEnd: 200, heightEnd: 27.5 },
  ],
  sceneNodes: {
    outerShell: "v2_Aussenhuelle",
    sellingFlapPivot: "v2_Klappe_Drehpunkt",
    doorPivot: "v2_Tuer_Drehpunkt",
    interiorFloor: "v2_Bodenbelag_PVC",
    roof: [] as readonly string[],
    walls: [] as readonly string[],
  },
  animation: {
    sellingFlapClip: "v2_Klappe_DrehpunktAction",
    sellingFlapOpenTimeSeconds: 2.5,
  },
};

export const standardEquipment: readonly StandardEquipmentDefinition[] = [];

export const sidebarEquipmentIds: readonly string[] = [];
