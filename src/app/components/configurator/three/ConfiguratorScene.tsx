import { useEffect, useRef, useState } from "react";
import {
  Box3,
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Timer,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Texture } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ConfiguratorView, EquipmentSide } from "../types";
import { WatermarkOverlay } from "../WatermarkOverlay";
import { useConfiguratorCopy } from "../copy";
import {
  equipmentPlacementDefinitions,
  getEquipmentInterval,
  type EquipmentConfigurationState,
  type EquipmentPlacement,
} from "../data/equipmentConfiguration";
import { CameraController } from "./CameraController";
import { cameraPresets } from "./cameraPresets";
import { loadConfiguratorModel } from "./ModelLoader";
import { installStudioEnvironment } from "./StudioEnvironment";

type ConfiguratorSceneProps = {
  view: ConfiguratorView;
  started: boolean;
  equipmentState: EquipmentConfigurationState;
};

type SceneRuntime = {
  cameraController: CameraController;
  controls: OrbitControls;
  applyConfiguration: (state: EquipmentConfigurationState) => void;
  applyViewVisibility: (view: ConfiguratorView) => void;
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
};

const MODEL_SCALE = 0.1;
const TRAILER_LENGTH_CM = 360;
const TRAILER_MIN_X = -1.8;
const GAS_GRIDDLE_HALF_WIDTH = 0.33025;
const GAS_GRIDDLE_NICHE_HALF_WIDTH = GAS_GRIDDLE_HALF_WIDTH + 0.03;
const CLOSED_WALL_NAME = "ASEA_ClosedWall";
const SALES_WALL_NAME = "ASEA_SalesWall";
const GAS_CABINET_EXTERNAL_CONNECTIONS = [
  "Gasschrank_710x600x850_Absperrhahn",
  "Gasschrank_710x600x850_Absperrhahn_Hebel",
  "Gasschrank_710x600x850_Gasleitung_aussen",
  "Gasschrank_710x600x850_Pruefanschluss",
  "Gasschrank_710x600x850_Schottverschraubung",
] as const;

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

function addGasGriddleNiche(parent: Group) {
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });
  const nicheWidth = GAS_GRIDDLE_NICHE_HALF_WIDTH * 2;
  addBox(parent, [nicheWidth, 0.03, 0.6], [0, 0.585, 0.7], steel);
  addBox(parent, [0.03, 0.33, 0.6], [-GAS_GRIDDLE_NICHE_HALF_WIDTH + 0.015, 0.685, 0.7], steel);
  addBox(parent, [0.03, 0.33, 0.6], [GAS_GRIDDLE_NICHE_HALF_WIDTH - 0.015, 0.685, 0.7], steel);
}

function centimetersToWorldX(valueCm: number) {
  return TRAILER_MIN_X + valueCm / 100;
}

type CounterInterval = { startCm: number; endCm: number };

function getFreeIntervals(blockedIntervals: readonly CounterInterval[]) {
  const sorted = [...blockedIntervals].sort((a, b) => a.startCm - b.startCm);
  const merged = sorted.reduce<CounterInterval[]>((result, interval) => {
    const previous = result.at(-1);
    if (!previous || interval.startCm > previous.endCm) result.push({ ...interval });
    else previous.endCm = Math.max(previous.endCm, interval.endCm);
    return result;
  }, []);
  const free: CounterInterval[] = [];
  let cursor = 0;
  merged.forEach((interval) => {
    if (interval.startCm > cursor) free.push({ startCm: cursor, endCm: interval.startCm });
    cursor = Math.max(cursor, interval.endCm);
  });
  if (cursor < TRAILER_LENGTH_CM) free.push({ startCm: cursor, endCm: TRAILER_LENGTH_CM });
  return free;
}

function createInteriorShell(floorTexture: Texture) {
  const shell = new Group();
  shell.name = "ASEA_InteriorShell";
  const wall = new MeshStandardMaterial({ color: 0xe7e7e3, roughness: 0.74, metalness: 0.05 });
  const floorBase = new MeshStandardMaterial({ color: 0x777a73, roughness: 0.82, metalness: 0 });
  const floorSurface = new MeshStandardMaterial({ map: floorTexture, roughness: 0.88, metalness: 0 });
  const trim = new MeshStandardMaterial({ color: 0x30322f, roughness: 0.58, metalness: 0.3 });

  addBox(shell, [3.6, 0.05, 2], [0, -0.025, 0], floorBase);
  const woodFloor = new Mesh(new PlaneGeometry(3.6, 2), floorSurface);
  woodFloor.name = "ASEA_WoodFloor";
  woodFloor.rotation.x = -Math.PI / 2;
  woodFloor.position.y = 0.002;
  woodFloor.receiveShadow = true;
  shell.add(woodFloor);

  const closedWall = new Group();
  closedWall.name = CLOSED_WALL_NAME;
  addBox(closedWall, [3.6, 2.3, 0.04], [0, 1.15, -1.02], wall);
  shell.add(closedWall);
  addBox(shell, [0.04, 2.3, 2], [-1.82, 1.15, 0], wall);
  addBox(shell, [0.04, 2.3, 0.6], [1.82, 1.15, 0.7], wall);
  addBox(shell, [0.04, 2.3, 0.6], [1.82, 1.15, -0.7], wall);
  addBox(shell, [0.04, 0.3, 0.8], [1.82, 2.15, 0], wall);

  const salesWall = new Group();
  salesWall.name = SALES_WALL_NAME;
  addBox(salesWall, [3.6, 0.76, 0.04], [0, 0.38, 1.02], wall);
  addBox(salesWall, [3.62, 0.035, 0.055], [0, 0.79, 1.025], trim);
  shell.add(salesWall);
  return shell;
}

function prepareModel(model: Group, rotationY: number, placement: Placement) {
  model.rotation.y = rotationY;
  model.scale.setScalar(MODEL_SCALE);
  model.updateMatrixWorld(true);
  let bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  if (placement.width) model.scale.multiplyScalar(placement.width / size.x);
  model.updateMatrixWorld(true);
  bounds = new Box3().setFromObject(model);
  if (placement.height) model.scale.y *= placement.height / bounds.getSize(new Vector3()).y;
  model.updateMatrixWorld(true);
  bounds = new Box3().setFromObject(model);

  const center = bounds.getCenter(new Vector3());
  const offset = new Vector3(0, placement.minY - bounds.min.y, 0);
  if (placement.minX !== undefined) offset.x = placement.minX - bounds.min.x;
  if (placement.centerX !== undefined) offset.x = placement.centerX - center.x;
  if (placement.minZ !== undefined) offset.z = placement.minZ - bounds.min.z;
  if (placement.maxZ !== undefined) offset.z = placement.maxZ - bounds.max.z;
  if (placement.centerZ !== undefined) offset.z = placement.centerZ - center.z;
  model.position.add(offset);

  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const transparent = materials.some((material) => material.transparent);
    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.transparent) {
        material.depthWrite = false;
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.45);
      } else if (material.metalness >= 0.8) {
        material.roughness = Math.max(material.roughness, 0.42);
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.65);
      }
    });
    object.castShadow = !transparent;
    object.receiveShadow = !transparent;
  });
  return model;
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
  asset: Group | undefined,
  fallbackSizeCm: readonly [number, number, number],
  rotationY: number,
  placement: Placement,
) {
  parent.add(asset ? prepareModel(asset.scene.clone(true), rotationY, placement) : fallbackModel(fallbackSizeCm));
}

function createEquipmentVisual(item: EquipmentPlacement, assets: ModelAssets) {
  const group = new Group();
  group.name = item.id;
  const rotation = item.side === "closed-wall" ? -Math.PI / 2 : Math.PI / 2;
  const side = item.side;

  switch (item.productId) {
    case "fryer":
      addPart(group, assets.fryer, [30, 85, 60], rotation, sidePlacement(side, 0.4328, 0.3));
      addPart(group, assets.hood, [60, 88, 60], rotation, sidePlacement(side, 1.36, 0.6));
      break;
    case "double-fryer":
      addPart(group, assets.doubleFryer, [59, 41, 60], rotation, sidePlacement(side, 0.4328, 0.59));
      addPart(group, assets.hood, [60, 88, 60], rotation, sidePlacement(side, 1.36, 0.6));
      break;
    case "gas-griddle":
      addGasGriddleNiche(group);
      addPart(group, assets.gasGriddle, [66, 25, 60], rotation, sidePlacement(side, 0.6, 0.6605));
      addPart(group, assets.splashGuard, [77, 40, 7], rotation, sidePlacement(side, 0.85, 0.77));
      break;
    case "contact-grill":
      addPart(group, assets.contactGrill, [41, 20, 46], rotation, sidePlacement(side, 0.85, 0.41));
      break;
    case "electric-griddle":
      addPart(group, assets.electricGriddle, [60, 12, 45], rotation, sidePlacement(side, 0.85, 0.6));
      break;
    case "induction":
      addPart(group, assets.induction, [50, 12, 45], rotation, sidePlacement(side, 0.85, 0.5));
      break;
    case "bottle-fridge":
      addPart(group, assets.bottleFridge, [61, 173, 64], rotation, sidePlacement(side, 0, 0.61, 1.73));
      break;
    case "cooling-top":
      addPart(group, assets.coolingTop, [120, 46, 40], rotation, sidePlacement(side, 0.85, 1.2));
      break;
    case "undercounter-fridge":
      addPart(group, assets.undercounterFridge, [60, 81, 60], rotation, sidePlacement(side, 0, 0.6, 0.81));
      break;
    case "double-sink":
      addPart(group, assets.doubleSink, [90, 15, 55], rotation, sidePlacement(side, 0.83, 0.9));
      break;
    case "hygiene-area":
      addPart(group, assets.hygieneArea, [100, 211, 60], rotation, sidePlacement(side, 0, 1));
      break;
    case "worktable":
      addPart(group, assets.worktable, [120, 85, 60], rotation, sidePlacement(side, 0, 1.2));
      break;
    case "wall-cabinet":
      addPart(group, assets.wallCabinet, [60, 60, 35], rotation, sidePlacement(side, 1.36, 0.6));
      break;
    case "splash-guard":
      addPart(group, assets.splashGuard, [77, 40, 7], rotation, sidePlacement(side, 0.85, 0.77));
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
  const blocked = state.items
    .filter((item) => item.side === side && equipmentPlacementDefinitions[item.productId].blocksCountertop)
    .map((item) => getEquipmentInterval(item));
  if (side === "closed-wall") blocked.push({ startCm: 0, endCm: 71 });
  const freeIntervals = getFreeIntervals(blocked);
  const centerZ = side === "closed-wall" ? -0.7 : 0.7;

  freeIntervals.forEach((interval) => {
    if (interval.endCm - interval.startCm < 0.5) return;
    addCountertop(furniture, centimetersToWorldX(interval.startCm), centimetersToWorldX(interval.endCm), centerZ);

    if (!standAsset) return;
    const supportCenters = [interval.startCm, interval.endCm];
    for (let support = interval.startCm + 100; support < interval.endCm - 20; support += 100) {
      supportCenters.push(support);
    }
    supportCenters.forEach((supportCm) => {
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
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) material.map?.dispose();
      material.dispose();
    });
  });
}

async function loadOptional(path: string) {
  try {
    return await loadConfiguratorModel(path);
  } catch (error) {
    console.warn(`Configurator model unavailable: ${path}`, error);
    return undefined;
  }
}

export function ConfiguratorScene({ view, started, equipmentState }: ConfiguratorSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const startedRef = useRef(started);
  const viewRef = useRef(view);
  const equipmentStateRef = useRef(equipmentState);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const { text } = useConfiguratorCopy();
  const sceneLabel = text("sceneLabel");

  useEffect(() => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (canvas) canvas.setAttribute("aria-label", sceneLabel);
  }, [sceneLabel]);

  useEffect(() => {
    startedRef.current = started;
    if (started) runtimeRef.current?.cameraController.moveTo(cameraPresets.interior, 900);
  }, [started]);

  useEffect(() => {
    viewRef.current = view;
    runtimeRef.current?.cameraController.moveTo(cameraPresets[view], 700);
    runtimeRef.current?.applyViewVisibility(view);
  }, [view]);

  useEffect(() => {
    equipmentStateRef.current = equipmentState;
    runtimeRef.current?.applyConfiguration(equipmentState);
  }, [equipmentState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let frameId = 0;
    let interiorShell: Group | null = null;
    let standardModels: Group | null = null;
    let closedWallEquipment: Group | null = null;
    let salesWallEquipment: Group | null = null;
    let closedFurniture: Group | null = null;
    let salesFurniture: Group | null = null;
    const equipmentGroups = new Map<string, Group>();
    let assets: ModelAssets = {};
    const scene = new Scene();
    const camera = new PerspectiveCamera(cameraPresets.three.fov, 1, 0.05, 100);
    camera.position.set(...cameraPresets.three.position);
    camera.up.set(...cameraPresets.three.up);
    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    const applyViewVisibility = (currentView: ConfiguratorView) => {
      const hideCustomerSide = currentView === "front";
      const hideSellerSide = currentView === "rear";
      const closedWall = interiorShell?.getObjectByName(CLOSED_WALL_NAME);
      const salesWall = interiorShell?.getObjectByName(SALES_WALL_NAME);
      if (closedWall) closedWall.visible = !hideSellerSide;
      if (salesWall) salesWall.visible = !hideCustomerSide;
      if (closedWallEquipment) closedWallEquipment.visible = !hideSellerSide;
      if (salesWallEquipment) salesWallEquipment.visible = !hideCustomerSide;
      if (closedFurniture) closedFurniture.visible = !hideSellerSide;
      if (salesFurniture) salesFurniture.visible = !hideCustomerSide;
    };

    const applyConfiguration = (state: EquipmentConfigurationState) => {
      if (!standardModels || !closedWallEquipment || !salesWallEquipment || !closedFurniture || !salesFurniture) return;
      const activeIds = new Set(state.items.map((item) => item.id));
      equipmentGroups.forEach((group, id) => {
        if (activeIds.has(id)) return;
        group.parent?.remove(group);
        equipmentGroups.delete(id);
      });
      state.items.forEach((item) => {
        let group = equipmentGroups.get(item.id);
        if (!group) {
          group = createEquipmentVisual(item, assets);
          equipmentGroups.set(item.id, group);
        }
        const equipmentParent = item.side === "closed-wall" ? closedWallEquipment : salesWallEquipment;
        if (group.parent !== equipmentParent) equipmentParent.add(group);
        group.position.x = centimetersToWorldX(item.centerCm);
      });

      if (closedFurniture) {
        closedFurniture.removeFromParent();
        disposeGroup(closedFurniture);
      }
      if (salesFurniture) {
        salesFurniture.removeFromParent();
        disposeGroup(salesFurniture);
      }
      closedFurniture = createCounterFurniture(state, "closed-wall", assets.countertopStand);
      salesFurniture = createCounterFurniture(state, "sales-hatch", assets.countertopStand);
      closedWallEquipment.add(closedFurniture);
      salesWallEquipment.add(salesFurniture);
      applyViewVisibility(viewRef.current);
    };
    runtimeRef.current = { cameraController, controls, applyConfiguration, applyViewVisibility };

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    const timer = new Timer();
    const render = () => {
      timer.update();
      cameraController.update(Math.min(timer.getDelta(), 0.05));
      controls.enabled = startedRef.current && viewRef.current === "three" && !cameraController.isAnimating;
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    async function loadConfiguration() {
      try {
        const [floorTexture, gasCabinet, doubleFryer, hygieneArea, undercounterFridge, gasGriddle, hood, splashGuard, countertopStand, fryer, contactGrill, electricGriddle, induction, bottleFridge, coolingTop, doubleSink, worktable, wallCabinet] = await Promise.all([
          new TextureLoader().loadAsync("/configurator-textures/floor/grey-oak-vinyl.png"),
          loadConfiguratorModel("/configurator-models/interieur/moebel/Gasschrank.glb"),
          loadConfiguratorModel("/configurator-models/interieur/kochen/Doppelfriteuse.glb"),
          loadConfiguratorModel("/configurator-models/interieur/hygiene/Hygienebereich.glb"),
          loadConfiguratorModel("/configurator-models/interieur/kuehlung/Kuehlschrank_Unterbau.glb"),
          loadConfiguratorModel("/configurator-models/interieur/kochen/Gasbraeter.glb"),
          loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb"),
          loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Spritzschutz_700.glb"),
          loadConfiguratorModel("/configurator-models/interieur/arbeitsflaechen/Arbeitsplatten_Staender.glb"),
          loadOptional("/configurator-models/interieur/kochen/Friteuse.glb"),
          loadOptional("/configurator-models/interieur/kochen/Kontaktgrill.glb"),
          loadOptional("/configurator-models/interieur/kochen/Griddleplatte_Elektro.glb"),
          loadOptional("/configurator-models/interieur/kochen/Induktionskocher.glb"),
          loadOptional("/configurator-models/interieur/kuehlung/Flaschenkuehlschrank_gross.glb"),
          loadOptional("/configurator-models/interieur/kuehlung/Kuehlaufsatz.glb"),
          loadOptional("/configurator-models/interieur/hygiene/Doppelwaschbecken.glb"),
          loadOptional("/configurator-models/interieur/moebel/Arbeitstisch_1200.glb"),
          loadOptional("/configurator-models/interieur/moebel/Haengeschrank.glb"),
        ]);
        if (disposed) return;
        floorTexture.colorSpace = SRGBColorSpace;
        floorTexture.wrapS = RepeatWrapping;
        floorTexture.wrapT = RepeatWrapping;
        floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        floorTexture.needsUpdate = true;
        assets = { gasCabinet, doubleFryer, hygieneArea, undercounterFridge, gasGriddle, hood, splashGuard, countertopStand, fryer, contactGrill, electricGriddle, induction, bottleFridge, coolingTop, doubleSink, worktable, wallCabinet };
        interiorShell = createInteriorShell(floorTexture);
        scene.add(interiorShell);
        GAS_CABINET_EXTERNAL_CONNECTIONS.forEach((nodeName) => gasCabinet.scene.getObjectByName(nodeName)?.removeFromParent());
        standardModels = new Group();
        closedWallEquipment = new Group();
        salesWallEquipment = new Group();
        closedFurniture = new Group();
        salesFurniture = new Group();
        standardModels.name = "ASEA_StandardEquipment";
        closedWallEquipment.name = "ASEA_ClosedWallEquipment";
        salesWallEquipment.name = "ASEA_SalesWallEquipment";
        closedWallEquipment.add(prepareModel(gasCabinet.scene, Math.PI / 2, { minX: -1.8, minY: 0, minZ: -1 }));
        standardModels.add(closedWallEquipment, salesWallEquipment);
        scene.add(standardModels);
        applyConfiguration(equipmentStateRef.current);
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
      controls.dispose();
      studioEnvironment.dispose();
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
}
