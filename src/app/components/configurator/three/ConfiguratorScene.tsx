import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Box3,
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ConfiguratorView, EquipmentSide } from "../types";
import { WatermarkOverlay } from "../WatermarkOverlay";
import { useConfiguratorCopy } from "../copy";
import {
  equipmentPlacementDefinitions,
  type EquipmentCorner,
  type EquipmentConfigurationState,
  type EquipmentPlacement,
} from "../data/equipmentConfiguration";
import { getCountertopIntervals } from "../data/configurationSummary";
import { trailerConfiguration } from "../data/defaultConfiguration";
import { CameraController } from "./CameraController";
import { cameraPresets } from "./cameraPresets";
import { loadConfiguratorModel } from "./ModelLoader";
import { installStudioEnvironment } from "./StudioEnvironment";
import { prepareTrailerModel } from "./TrailerModel";
import { createSalesHatchFrontPanel } from "./SalesHatchFrontPanel";
import { removeHygieneWallCabinet } from "./hygieneArea";
import {
  captureConfigurationScreenshots,
  type ConfigurationScreenshots,
} from "./configurationScreenshots";
import { applyConfiguratorViewVisibility } from "./viewVisibility";

type ConfiguratorSceneProps = {
  view: ConfiguratorView;
  started: boolean;
  equipmentState: EquipmentConfigurationState;
  selectedEquipmentId: string | null;
};

type SceneRuntime = {
  cameraController: CameraController;
  controls: OrbitControls;
  requestRender: () => void;
  applyConfiguration: (state: EquipmentConfigurationState) => void;
  applyViewVisibility: (view: ConfiguratorView) => void;
  highlightEquipment: (equipmentId: string | null) => void;
  captureConfigurationViews: () => ConfigurationScreenshots;
};

export type ConfiguratorSceneHandle = {
  captureConfigurationViews: () => ConfigurationScreenshots;
};

type Placement = {
  minX?: number;
  centerX?: number;
  minY: number;
  minZ?: number;
  maxZ?: number;
  centerZ?: number;
  width?: number;
  height?: number;
  depth?: number;
};

const MODEL_SCALE = 0.1;
const TRAILER_LENGTH_CM = 360;
const TRAILER_MIN_X = -1.8;
const WHEEL_ARCH = trailerConfiguration.wheelArchesFromModelCm[0];
const WHEEL_ARCH_START_CM = WHEEL_ARCH.longitudinalStart;
const WHEEL_ARCH_END_CM = WHEEL_ARCH.longitudinalEnd;
const WHEEL_ARCH_HEIGHT = WHEEL_ARCH.heightEnd / 100;
const WHEEL_ARCH_DEPTH = (WHEEL_ARCH.depthEnd - WHEEL_ARCH.depthStart) / 100;
const CLOSED_WALL_NAME = "ASEA_ClosedWall";
const END_WALLS_NAME = "ASEA_EndWalls";
type ModelAsset = { scene: Group };
type ModelAssets = Partial<Record<string, ModelAsset>>;

function addBox(
  parent: Group,
  size: readonly [number, number, number],
  position: readonly [number, number, number],
  material: MeshStandardMaterial,
) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

function addCountertop(parent: Group, startX: number, endX: number, centerZ: number, depth = 0.6) {
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });
  addBox(parent, [endX - startX, 0.04, depth], [(startX + endX) / 2, 0.83, centerZ], steel);
}

function createGasCabinetBoardUnit() {
  const unit = new Group();
  unit.name = "ASEA_GasCabinetBoardUnit";
  const board = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });
  const startX = centimetersToWorldX(0);
  const endX = centimetersToWorldX(71);
  const width = endX - startX;
  const centerX = (startX + endX) / 2;
  const centerZ = -0.7;
  const frontZ = -0.415;

  // Worktop construction in the former gas-cabinet area: top, closed front
  // and right side panel, all using the same material as the worktops.
  addBox(unit, [width, 0.04, 0.6], [centerX, 0.83, centerZ], board);
  addBox(unit, [width, 0.81, 0.03], [centerX, 0.405, frontZ], board);
  addBox(unit, [0.03, 0.81, 0.57], [endX - 0.015, 0.405, centerZ - 0.015], board);
  return unit;
}

function addGriddleNiche(parent: Group, side: EquipmentSide, applianceWidth: number) {
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });
  const nicheHalfWidth = applianceWidth / 2 + 0.03;
  const nicheWidth = nicheHalfWidth * 2;
  const centerZ = side === "closed-wall" ? -0.7 : 0.7;
  const nicheDepth = side === "sales-hatch" ? 0.52 : 0.6;
  const nicheCenterZ = side === "sales-hatch" ? centerZ - 0.04 : centerZ;
  addBox(parent, [nicheWidth, 0.03, nicheDepth], [0, 0.585, nicheCenterZ], steel);
  addBox(parent, [0.03, 0.33, nicheDepth], [-nicheHalfWidth + 0.015, 0.685, nicheCenterZ], steel);
  addBox(parent, [0.03, 0.33, nicheDepth], [nicheHalfWidth - 0.015, 0.685, nicheCenterZ], steel);
  if (side === "sales-hatch") {
    // Keep the front edge of the worktop continuous around recessed griddles.
    addBox(parent, [nicheWidth, 0.04, 0.08], [0, 0.83, 0.96], steel);
  }
}

function centimetersToWorldX(valueCm: number) {
  return TRAILER_MIN_X + valueCm / 100;
}

function createInteriorShell() {
  const shell = new Group();
  shell.name = "ASEA_InteriorShell";
  const wall = new MeshStandardMaterial({ color: 0xe7e7e3, roughness: 0.74, metalness: 0.05 });

  const closedWall = new Group();
  closedWall.name = CLOSED_WALL_NAME;
  addBox(closedWall, [3.6, 2.3, 0.04], [0, 1.15, -1.02], wall);
  shell.add(closedWall);
  const endWalls = new Group();
  endWalls.name = END_WALLS_NAME;
  addBox(endWalls, [0.04, 2.3, 2], [-1.82, 1.15, 0], wall);
  addBox(endWalls, [0.04, 2.3, 0.6], [1.82, 1.15, 0.7], wall);
  addBox(endWalls, [0.04, 2.3, 0.6], [1.82, 1.15, -0.7], wall);
  addBox(endWalls, [0.04, 0.3, 0.8], [1.82, 2.15, 0], wall);
  shell.add(endWalls);

  return shell;
}

function prepareModel(model: Group, rotationY: number, placement: Placement) {
  const wrapper = new Group();
  wrapper.add(model);
  model.rotation.y = rotationY;
  model.scale.setScalar(MODEL_SCALE);
  wrapper.updateMatrixWorld(true);
  let bounds = new Box3().setFromObject(wrapper);
  const size = bounds.getSize(new Vector3());
  if (placement.width) wrapper.scale.x *= placement.width / size.x;
  if (placement.height) wrapper.scale.y *= placement.height / size.y;
  if (placement.depth) wrapper.scale.z *= placement.depth / size.z;
  wrapper.updateMatrixWorld(true);
  bounds = new Box3().setFromObject(wrapper);

  const center = bounds.getCenter(new Vector3());
  const offset = new Vector3(-center.x, placement.minY - bounds.min.y, 0);
  if (placement.minX !== undefined) offset.x = placement.minX - bounds.min.x;
  if (placement.centerX !== undefined) offset.x = placement.centerX - center.x;
  if (placement.minZ !== undefined) offset.z = placement.minZ - bounds.min.z;
  if (placement.maxZ !== undefined) offset.z = placement.maxZ - bounds.max.z;
  if (placement.centerZ !== undefined) offset.z = placement.centerZ - center.z;
  wrapper.position.add(offset);

  wrapper.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.userData.sharedModelAsset = true;
    // SkeletonUtils.clone keeps materials shared between model instances. Clone
    // them here so one equipment item cannot change another item's rendering.
    const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
    const materials = sourceMaterials.map((material) => material.clone());
    object.material = Array.isArray(object.material) ? materials : materials[0];
    const transparent = materials.some((material) => material.transparent);
    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.transparent) {
        material.depthWrite = false;
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.45);
      } else {
        // Prevent mirror-like GLB materials from becoming black when the camera
        // moves across a thin or overlapping stainless-steel surface.
        material.metalness = Math.min(material.metalness, 0.78);
        material.roughness = Math.max(material.roughness, 0.3);
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.8);
        material.needsUpdate = true;
      }
    });
    // Imported equipment has many thin, coplanar faces. Let the studio shell
    // provide the stable shadows instead of producing shadow-acne flicker on
    // sinks, worktops and cabinet fronts while orbiting the scene.
    object.castShadow = false;
    object.receiveShadow = false;
  });
  return wrapper;
}

function fallbackModel(sizeCm: readonly [number, number, number], materialColor = 0xb7b5ac) {
  const group = new Group();
  const material = new MeshStandardMaterial({ color: materialColor, roughness: 0.62, metalness: 0.18 });
  addBox(group, [sizeCm[0] / 100, sizeCm[1] / 100, sizeCm[2] / 100], [0, sizeCm[1] / 200, 0], material);
  return group;
}

function sidePlacement(side: EquipmentSide, minY: number, width: number, height?: number): Placement {
  return side === "closed-wall"
    ? { minY, minZ: -1, width, height }
    : { minY, maxZ: 1, width, height };
}

function addPart(
  parent: Group,
  asset: ModelAsset | undefined,
  fallbackSizeCm: readonly [number, number, number],
  rotationY: number,
  placement: Placement,
) {
  parent.add(asset ? prepareModel(asset.scene.clone(true), rotationY, placement) : fallbackModel(fallbackSizeCm));
}

function createEquipmentVisual(item: EquipmentPlacement, assets: ModelAssets) {
  const group = new Group();
  group.name = item.id;
  group.userData.equipmentSide = item.side;
  group.userData.visualKey = `${item.productId}:${item.side}:${item.placementKey ?? "side"}:${item.widthCm ?? "default"}`;
  const definition = equipmentPlacementDefinitions[item.productId];
  const configuredRotation = item.placementKey === "trailer-end"
    ? definition.crossPlacement?.rotationDeg
    : definition.placementType === "fixed"
      ? definition.fixedPlacement?.rotationDeg
      : definition.placementType === "corner" && item.placementKey
        ? definition.cornerPlacements?.[item.placementKey as EquipmentCorner]?.rotationDeg
        : undefined;
  const rotation = configuredRotation !== undefined
    ? configuredRotation * Math.PI / 180
    : item.side === "closed-wall" ? -Math.PI / 2 : Math.PI / 2;
  const side = item.side;

  switch (item.productId) {
    case "fryer":
      addPart(group, assets.fryer, [30, 85, 60], rotation, sidePlacement(side, 0.5328, 0.3));
      break;
    case "double-fryer":
      addPart(group, assets.doubleFryer, [59, 41, 60], rotation, sidePlacement(side, 0.5328, 0.59));
      break;
    case "extractor-hood": {
      const hoodWidthCm = item.widthCm ?? definition.widthCm;
      addPart(
        group,
        assets.hood,
        [hoodWidthCm, 28, 70],
        rotation,
        sidePlacement(side, (definition.placementConstraints?.topMinYCm ?? 202) / 100, hoodWidthCm / 100),
      );
      break;
    }
    case "gas-griddle":
      addGriddleNiche(group, side, 0.6605);
      addPart(group, assets.gasGriddle, [66, 27.9, 60], rotation, sidePlacement(side, 0.571, 0.6605));
      break;
    case "contact-grill":
      addPart(group, assets.contactGrill, [41, 20, 46], rotation, sidePlacement(side, 0.85, 0.41));
      break;
    case "electric-griddle":
      addGriddleNiche(group, side, 0.6604);
      addPart(group, assets.electricGriddle, [66, 31, 58], rotation, sidePlacement(side, 0.54, 0.6604));
      break;
    case "induction":
      addPart(group, assets.induction, [33, 10.5, 47], rotation, sidePlacement(side, 0.85, 0.33));
      break;
    case "bottle-fridge":
      addPart(group, assets.bottleFridge, [61, 173, 64], rotation, sidePlacement(side, 0, 0.61, 1.73));
      break;
    case "cooling-top":
      addPart(
        group,
        assets.coolingTop,
        [120, 46, 40],
        rotation,
        item.placementKey === "trailer-end"
          ? { minY: 0.85, centerZ: 0, width: 0.4, depth: 2 }
          : sidePlacement(side, 0.85, 1.2),
      );
      break;
    case "undercounter-fridge":
      addPart(group, assets.undercounterFridge, [60, 81, 60], rotation, sidePlacement(side, 0, 0.6, 0.81));
      break;
    case "double-sink":
      addPart(group, assets.doubleSink, [100, 136, 62], rotation, sidePlacement(side, 0, 1));
      break;
    case "hygiene-area":
      if (assets.hygieneArea) {
        group.add(
          prepareModel(
            removeHygieneWallCabinet(assets.hygieneArea.scene.clone(true)),
            rotation,
            sidePlacement(side, 0, 1),
          ),
        );
      } else {
        addPart(group, undefined, [100, 145, 60], rotation, sidePlacement(side, 0, 1));
      }
      break;
    case "worktable":
      addPart(group, assets.worktable, [120, 85, 60], rotation, sidePlacement(side, 0, 1.2));
      break;
    case "wall-cabinet":
      addPart(group, assets.wallCabinet, [100, 66, 40], rotation, {
        ...sidePlacement(side, 1.45, 1, 0.66),
        depth: 0.4,
      });
      break;
    case "splash-guard":
      {
        const splashWidthCm = item.widthCm ?? definition.widthCm;
        addPart(group, assets.splashGuard, [splashWidthCm, 40, 7], rotation, sidePlacement(side, 0.85, splashWidthCm / 100));
      }
      break;
    case "kebab-spit":
      addPart(group, assets.kebabSpit, [61, 116, 70], rotation, sidePlacement(side, 0.85, 0.61));
      break;
  }
  return group;
}

function createCounterFurniture(
  state: EquipmentConfigurationState,
  side: EquipmentSide,
  standAsset?: ModelAsset,
) {
  const furniture = new Group();
  furniture.name = `ASEA_${side}_CounterFurniture`;
  const panelMaterial = side === "closed-wall"
    ? new MeshStandardMaterial({ color: 0x4b4b48, roughness: 0.82, metalness: 0.04 })
    : null;
  const freeIntervals = getCountertopIntervals(state, side);
  const centerZ = side === "closed-wall" ? -0.7 : 0.7;
  const addedPanels = new Set<string>();

  const addClosedWallPanel = (boundaryCm: number, direction: -1 | 1) => {
    if (!panelMaterial || boundaryCm <= 0 || boundaryCm >= TRAILER_LENGTH_CM) return;
    const width = 0.03;
    const centerCm = boundaryCm + direction * width * 50;
    const key = centerCm.toFixed(2);
    if (addedPanels.has(key)) return;
    addedPanels.add(key);

    const aboveWheelArch = centerCm >= WHEEL_ARCH_START_CM && centerCm <= WHEEL_ARCH_END_CM;
    const minY = aboveWheelArch ? WHEEL_ARCH_HEIGHT : 0;
    const height = 0.81 - minY;
    addBox(
      furniture,
      [width, height, 0.58],
      [centimetersToWorldX(centerCm), minY + height / 2, centerZ],
      panelMaterial,
    );
  };

  freeIntervals.forEach((interval) => {
    if (interval.endCm - interval.startCm < 0.5) return;
    addCountertop(furniture, centimetersToWorldX(interval.startCm), centimetersToWorldX(interval.endCm), centerZ);

    if (side === "closed-wall") {
      addClosedWallPanel(interval.startCm, 1);
      addClosedWallPanel(interval.endCm, -1);
      for (let supportCm = interval.startCm + 100; supportCm < interval.endCm - 20; supportCm += 100) {
        addClosedWallPanel(supportCm, 1);
      }
      return;
    }

    if (!standAsset) return;
    const supportInsetCm = 5;
    const supportCenters = interval.endCm - interval.startCm >= supportInsetCm * 2
      ? [interval.startCm + supportInsetCm, interval.endCm - supportInsetCm]
      : [];
    for (let support = interval.startCm + 100; support < interval.endCm - 20; support += 100) {
      supportCenters.push(support);
    }
    if (interval.startCm < WHEEL_ARCH_START_CM && interval.endCm > WHEEL_ARCH_END_CM) {
      supportCenters.push(WHEEL_ARCH_START_CM - supportInsetCm, WHEEL_ARCH_END_CM + supportInsetCm);
    }
    [...new Set(supportCenters.map((support) => Math.round(support * 2) / 2))]
      .filter((support) => support + 4.5 <= WHEEL_ARCH_START_CM || support - 4.5 >= WHEEL_ARCH_END_CM)
      .forEach((supportCm) => {
        const support = prepareModel(standAsset.scene.clone(true), 0, {
          centerX: 0,
          minY: 0,
          centerZ: centerZ,
        });
        support.position.x = centimetersToWorldX(supportCm);
        furniture.add(support);
      });
  });
  return furniture;
}

function disposeGroup(group: Group) {
  group.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    if (!object.userData.sharedModelAsset) object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (!object.userData.sharedModelAsset && material instanceof MeshStandardMaterial) material.map?.dispose();
      material.dispose();
    });
  });
}

async function loadOptional(path: string, sceneNodeName: string | null = null) {
  try {
    return await loadConfiguratorModel(path, sceneNodeName);
  } catch (error) {
    console.warn(`Configurator model unavailable: ${path}`, error);
    return undefined;
  }
}

export const ConfiguratorScene = forwardRef<ConfiguratorSceneHandle, ConfiguratorSceneProps>(function ConfiguratorScene(
  { view, started, equipmentState, selectedEquipmentId },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const startedRef = useRef(started);
  const viewRef = useRef(view);
  const equipmentStateRef = useRef(equipmentState);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const { text } = useConfiguratorCopy();
  const sceneLabel = text("sceneLabel");

  useImperativeHandle(ref, () => ({
    captureConfigurationViews() {
      if (!runtimeRef.current) throw new Error("Configurator scene is not ready.");
      return runtimeRef.current.captureConfigurationViews();
    },
  }), []);

  useEffect(() => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) canvas.setAttribute("aria-label", sceneLabel);
  }, [sceneLabel]);

  useEffect(() => {
    startedRef.current = started;
    if (started) {
      runtimeRef.current?.cameraController.moveTo(cameraPresets.interior, 900);
      runtimeRef.current?.requestRender();
    }
  }, [started]);

  useEffect(() => {
    viewRef.current = view;
    runtimeRef.current?.cameraController.moveTo(cameraPresets[view], 700);
    runtimeRef.current?.applyViewVisibility(view);
    runtimeRef.current?.requestRender();
  }, [view]);

  useEffect(() => {
    equipmentStateRef.current = equipmentState;
    runtimeRef.current?.applyConfiguration(equipmentState);
  }, [equipmentState]);

  useEffect(() => {
    runtimeRef.current?.highlightEquipment(selectedEquipmentId);
  }, [selectedEquipmentId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let frameId = 0;
    let trailerModel: Group | null = null;
    let interiorShell: Group | null = null;
    let standardModels: Group | null = null;
    let closedWallEquipment: Group | null = null;
    let salesWallEquipment: Group | null = null;
    let closedFurniture: Group | null = null;
    let salesFurniture: Group | null = null;
    let closedFurnitureKey = "";
    let salesFurnitureKey = "";
    const equipmentGroups = new Map<string, Group>();
    let highlightedGroup: Group | null = null;
    let highlightStartedAt = 0;
    let assets: ModelAssets = {};
    const scene = new Scene();
    const camera = new PerspectiveCamera(cameraPresets.three.fov, 1, 0.05, 100);
    camera.position.set(...cameraPresets.three.position);
    camera.up.set(...cameraPresets.three.up);
    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.setAttribute("aria-label", sceneLabel);
    container.appendChild(renderer.domElement);
    const studioEnvironment = installStudioEnvironment(scene, renderer);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...cameraPresets.three.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enabled = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 9;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.update();
    const cameraController = new CameraController(camera, controls);
    const requestRender = () => {
      if (!disposed && !frameId) frameId = requestAnimationFrame(render);
    };
    controls.addEventListener("change", requestRender);

    const applyViewVisibility = (currentView: ConfiguratorView) => {
      const hideCustomerSide = currentView === "front";
      const hideSellerSide = currentView === "rear";
      if (trailerModel) applyConfiguratorViewVisibility(trailerModel, currentView);
      if (interiorShell) interiorShell.visible = currentView === "top" || currentView === "rear";
      const closedWall = interiorShell?.getObjectByName(CLOSED_WALL_NAME);
      const endWalls = interiorShell?.getObjectByName(END_WALLS_NAME);
      if (closedWall) closedWall.visible = !hideSellerSide;
      if (endWalls) endWalls.visible = currentView === "top";
      if (closedWallEquipment) closedWallEquipment.visible = !hideSellerSide;
      if (salesWallEquipment) salesWallEquipment.visible = !hideCustomerSide;
      if (closedFurniture) closedFurniture.visible = !hideSellerSide;
      if (salesFurniture) salesFurniture.visible = !hideCustomerSide;
      requestRender();
    };

    const applyConfiguration = (state: EquipmentConfigurationState) => {
      if (!standardModels || !closedWallEquipment || !salesWallEquipment || !closedFurniture || !salesFurniture) return;
      const activeIds = new Set(state.items.map((item) => item.id));
      equipmentGroups.forEach((group, id) => {
        if (activeIds.has(id)) return;
        group.parent?.remove(group);
        disposeGroup(group);
        equipmentGroups.delete(id);
      });
      state.items.forEach((item) => {
        let group = equipmentGroups.get(item.id);
        const visualKey = `${item.productId}:${item.side}:${item.placementKey ?? "side"}:${item.widthCm ?? "default"}`;
        if (group && group.userData.visualKey !== visualKey) {
          group.removeFromParent();
          disposeGroup(group);
          equipmentGroups.delete(item.id);
          group = undefined;
        }
        if (!group) {
          group = createEquipmentVisual(item, assets);
          equipmentGroups.set(item.id, group);
        }
        const equipmentParent = item.side === "closed-wall" ? closedWallEquipment : salesWallEquipment;
        if (group.parent !== equipmentParent) equipmentParent.add(group);
        group.position.x = centimetersToWorldX(item.centerCm);
      });

      const nextClosedKey = JSON.stringify(getCountertopIntervals(state, "closed-wall"));
      if (nextClosedKey !== closedFurnitureKey) {
        closedFurniture.removeFromParent();
        disposeGroup(closedFurniture);
        // The rear row uses fixed side panels, not the metal stand model.
        closedFurniture = createCounterFurniture(state, "closed-wall");
        closedWallEquipment.add(closedFurniture);
        closedFurnitureKey = nextClosedKey;
      }
      const nextSalesKey = JSON.stringify(getCountertopIntervals(state, "sales-hatch"));
      if (nextSalesKey !== salesFurnitureKey) {
        salesFurniture.removeFromParent();
        disposeGroup(salesFurniture);
        salesFurniture = createCounterFurniture(state, "sales-hatch", assets.countertopStand);
        salesWallEquipment.add(salesFurniture);
        salesFurnitureKey = nextSalesKey;
      }
      applyViewVisibility(viewRef.current);
    };
    const clearHighlight = () => {
      highlightedGroup?.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!(material instanceof MeshStandardMaterial)) return;
          material.emissive.setRGB(0, 0, 0);
          material.emissiveIntensity = 0;
        });
      });
    };
    const highlightEquipment = (equipmentId: string | null) => {
      clearHighlight();
      highlightedGroup = equipmentId ? equipmentGroups.get(equipmentId) ?? null : null;
      highlightStartedAt = highlightedGroup ? performance.now() : 0;
      requestRender();
    };
    const captureConfigurationViews = () => {
      cameraController.cancel();
      const screenshots = captureConfigurationScreenshots({
        renderer,
        scene,
        camera,
        controls,
        currentView: viewRef.current,
        applyViewVisibility,
      });
      requestRender();
      return screenshots;
    };
    runtimeRef.current = {
      cameraController,
      controls,
      requestRender,
      applyConfiguration,
      applyViewVisibility,
      highlightEquipment,
      captureConfigurationViews,
    };

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    const timer = new Timer();
    function render() {
      frameId = 0;
      timer.update();
      const cameraMoving = cameraController.update(Math.min(timer.getDelta(), 0.05));
      controls.enabled = startedRef.current && viewRef.current === "three" && !cameraController.isAnimating;
      const orbitMoving = controls.enabled && controls.update();
      if (highlightedGroup) {
        const elapsed = performance.now() - highlightStartedAt;
        if (elapsed >= 4000 || !highlightedGroup.parent) {
          clearHighlight();
          highlightedGroup = null;
        } else {
          const pulse = 0.35 + (Math.sin(elapsed / 150) + 1) * 0.16;
          highlightedGroup.traverse((object) => {
            if (!(object instanceof Mesh)) return;
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              if (!(material instanceof MeshStandardMaterial)) return;
              material.emissive.setRGB(0.9 * pulse, 0.04 * pulse, 0.04 * pulse);
              material.emissiveIntensity = 1.8;
            });
          });
        }
      }
      renderer.render(scene, camera);
      if (cameraMoving || orbitMoving || highlightedGroup) requestRender();
    }
    requestRender();

    async function loadConfiguration() {
      try {
        const [trailer, doubleFryer, hygieneArea, undercounterFridge, gasGriddle, hood, splashGuard, countertopStand, fryer, contactGrill, electricGriddle, induction, bottleFridge, coolingTop, doubleSink, worktable, wallCabinet, kebabSpit] = await Promise.all([
          loadConfiguratorModel(trailerConfiguration.modelPath),
          loadConfiguratorModel("/configurator-models/interieur/kochen/Doppelfriteuse.glb", "Fritteuse_IMBISS_II"),
          loadConfiguratorModel("/configurator-models/interieur/hygiene/Hygienebereich.glb"),
          loadConfiguratorModel("/configurator-models/interieur/kuehlung/Kuehlschrank_Unterbau.glb", "Kuehlschrank_Unterbau_600x600x850"),
          loadConfiguratorModel("/configurator-models/interieur/kochen/Gasbraeter.glb", "Gasbraeter_gross_3fl"),
          loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb", "Dunstabzug_Flachhaube_600x700x220"),
          loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Spritzschutz_700.glb", "Spritzschutz_Glas_700x400"),
          loadConfiguratorModel("/configurator-models/interieur/arbeitsflaechen/Arbeitsplatten_Staender.glb", "Arbeitsplatten_Staender"),
          loadOptional("/configurator-models/interieur/kochen/Friteuse.glb", "Fritteuse_IMBISS_I"),
          loadOptional("/configurator-models/interieur/kochen/Kontaktgrill.glb", "Kontaktgrill_Panini-MDI_1GR_410x400x200"),
          loadOptional("/configurator-models/interieur/kochen/Griddleplatte_Elektro.glb", "Griddleplatte_Elektro_660x580x310_glatt"),
          loadOptional("/configurator-models/interieur/kochen/Induktionskocher.glb", "Induktionskocher_IK30T-1_Glas_330x420x105"),
          loadOptional("/configurator-models/interieur/kuehlung/Flaschenkuehlschrank_gross.glb", "Flaschenkuehlschrank_350L_600x600x1730"),
          loadOptional("/configurator-models/interieur/kuehlung/Kuehlaufsatz.glb", "Kuehlaufsatz_GL4-1201_1200x335x459"),
          loadOptional("/configurator-models/interieur/hygiene/Doppelwaschbecken.glb", "Doppelwaschbecken_1000x600x850"),
          loadOptional("/configurator-models/interieur/moebel/Arbeitstisch_1200.glb", "Arbeitstisch_1200x600x850"),
          loadOptional("/configurator-models/interieur/moebel/Haengeschrank.glb", "Haengeschrank_1000x400x660"),
          loadOptional("/configurator-models/interieur/kochen/Kebapspiess.glb"),
        ]);
        if (disposed) return;
        assets = { doubleFryer, hygieneArea, undercounterFridge, gasGriddle, hood, splashGuard, countertopStand, fryer, contactGrill, electricGriddle, induction, bottleFridge, coolingTop, doubleSink, worktable, wallCabinet, kebabSpit };
        trailerModel = prepareTrailerModel(trailer.scene, trailer.animations);
        interiorShell = createInteriorShell();
        scene.add(trailerModel, interiorShell);
        standardModels = new Group();
        closedWallEquipment = new Group();
        salesWallEquipment = new Group();
        closedFurniture = new Group();
        salesFurniture = new Group();
        standardModels.name = "ASEA_StandardEquipment";
        closedWallEquipment.name = "ASEA_ClosedWallEquipment";
        salesWallEquipment.name = "ASEA_SalesWallEquipment";
        closedWallEquipment.add(createGasCabinetBoardUnit());
        salesWallEquipment.add(createSalesHatchFrontPanel());
        standardModels.add(closedWallEquipment, salesWallEquipment);
        scene.add(standardModels);
        applyConfiguration(equipmentStateRef.current);
        applyViewVisibility(viewRef.current);
        highlightEquipment(selectedEquipmentId);
        setStatus("ready");
      } catch (error) {
        console.error("Configurator model loading failed:", error);
        if (!disposed) setStatus("error");
      }
    }
    void loadConfiguration();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener("change", requestRender);
      controls.dispose();
      studioEnvironment.dispose();
      if (trailerModel) disposeGroup(trailerModel);
      if (interiorShell) disposeGroup(interiorShell);
      if (standardModels) disposeGroup(standardModels);
      renderer.dispose();
      renderer.domElement.remove();
      runtimeRef.current = null;
    };
  }, []);

  return (
    <div className="asea-scene-shell">
      <div ref={containerRef} className="asea-scene" />
      {status !== "ready" && (
        <div className={`asea-scene-status${status === "error" ? " is-error" : ""}`} role="status">
          {status === "loading" ? <span className="asea-spinner" aria-hidden="true" /> : null}
          <span>{text(status === "error" ? "loadError" : "loading")}</span>
        </div>
      )}
      {status === "ready" && started && view === "three" && (
        <p className="asea-interaction-hint">{text("interactionHint")}</p>
      )}
      <WatermarkOverlay />
    </div>
  );
});
