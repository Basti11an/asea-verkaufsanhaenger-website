import { useEffect, useRef, useState } from "react";
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
import type { ConfiguratorView } from "../types";
import { WatermarkOverlay } from "../WatermarkOverlay";
import { useConfiguratorCopy } from "../copy";
import { CameraController } from "./CameraController";
import { cameraPresets } from "./cameraPresets";
import { loadConfiguratorModel } from "./ModelLoader";
import { installStudioEnvironment } from "./StudioEnvironment";

type ConfiguratorSceneProps = {
  view: ConfiguratorView;
  started: boolean;
};

type SceneRuntime = {
  cameraController: CameraController;
  controls: OrbitControls;
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
const GAS_GRIDDLE_HALF_WIDTH = 0.33025;
const GAS_GRIDDLE_NICHE_HALF_WIDTH = GAS_GRIDDLE_HALF_WIDTH + 0.03;
const GAS_CABINET_EXTERNAL_CONNECTIONS = [
  "Gasschrank_710x600x850_Absperrhahn",
  "Gasschrank_710x600x850_Absperrhahn_Hebel",
  "Gasschrank_710x600x850_Gasleitung_aussen",
  "Gasschrank_710x600x850_Pruefanschluss",
  "Gasschrank_710x600x850_Schottverschraubung",
] as const;
const FRONT_COUNTERTOP_STAND_POSITIONS = [
  [-1.755, 0.445],
  [-(GAS_GRIDDLE_NICHE_HALF_WIDTH + 0.045), 0.445],
  [GAS_GRIDDLE_NICHE_HALF_WIDTH + 0.045, 0.445],
  [1.755, 0.445],
] as const;

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
  const width = endX - startX;
  addBox(parent, [width, 0.04, depth], [(startX + endX) / 2, 0.83, centerZ], steel);
}

function addGasGriddleNiche(parent: Group) {
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });
  const nicheWidth = GAS_GRIDDLE_NICHE_HALF_WIDTH * 2;

  addBox(parent, [nicheWidth, 0.03, 0.6], [0, 0.585, 0.7], steel);
  addBox(parent, [0.03, 0.33, 0.6], [-GAS_GRIDDLE_NICHE_HALF_WIDTH + 0.015, 0.685, 0.7], steel);
  addBox(parent, [0.03, 0.33, 0.6], [GAS_GRIDDLE_NICHE_HALF_WIDTH - 0.015, 0.685, 0.7], steel);
}

function addRearCounterPanels(parent: Group) {
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.52, metalness: 0.55 });

  addBox(parent, [0.03, 0.81, 0.58], [-0.485, 0.405, -0.7], steel);
  addBox(parent, [0.03, 0.81, 0.58], [0.135, 0.405, -0.7], steel);
  addBox(parent, [0.05, 0.81, 0.58], [1.175, 0.405, -0.7], steel);
}

function createInteriorShell() {
  const shell = new Group();
  shell.name = "ASEA_InteriorShell";

  const wall = new MeshStandardMaterial({ color: 0xe7e7e3, roughness: 0.74, metalness: 0.05 });
  const floor = new MeshStandardMaterial({ color: 0x777a73, roughness: 0.82, metalness: 0 });
  const trim = new MeshStandardMaterial({ color: 0x30322f, roughness: 0.58, metalness: 0.3 });

  addBox(shell, [3.6, 0.05, 2], [0, -0.025, 0], floor);
  addBox(shell, [3.6, 2.3, 0.04], [0, 1.15, -1.02], wall);
  addBox(shell, [0.04, 2.3, 2], [-1.82, 1.15, 0], wall);

  // Rear wall with the 80 cm entrance from the plan left open.
  addBox(shell, [0.04, 2.3, 0.6], [1.82, 1.15, 0.7], wall);
  addBox(shell, [0.04, 2.3, 0.6], [1.82, 1.15, -0.7], wall);
  addBox(shell, [0.04, 0.3, 0.8], [1.82, 2.15, 0], wall);

  // The low sales-side wall shows the room boundary without hiding the equipment.
  addBox(shell, [3.6, 0.76, 0.04], [0, 0.38, 1.02], wall);
  addBox(shell, [3.62, 0.035, 0.055], [0, 0.79, 1.025], trim);

  addCountertop(shell, -0.5, 0.15, -0.7);
  addCountertop(shell, 1.15, 1.8, -0.7);
  addCountertop(shell, -1.8, -GAS_GRIDDLE_NICHE_HALF_WIDTH, 0.7);
  addCountertop(shell, GAS_GRIDDLE_NICHE_HALF_WIDTH, 1.8, 0.7);
  addRearCounterPanels(shell);
  addGasGriddleNiche(shell);

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
    if (object instanceof Mesh) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      const hasTransparentMaterial = materials.some((material) => material.transparent);

      materials.forEach((material) => {
        if (!(material instanceof MeshStandardMaterial)) return;

        if (material.transparent) {
          material.depthWrite = false;
          material.envMapIntensity = Math.min(material.envMapIntensity, 0.45);
          return;
        }

        if (material.metalness >= 0.8) {
          material.roughness = Math.max(material.roughness, 0.42);
          material.envMapIntensity = Math.min(material.envMapIntensity, 0.65);
        }
      });

      object.castShadow = !hasTransparentMaterial;
      object.receiveShadow = !hasTransparentMaterial;
    }
  });

  return model;
}

function disposeGroup(group: Group) {
  group.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => material.dispose());
  });
}

export function ConfiguratorScene({ view, started }: ConfiguratorSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const startedRef = useRef(started);
  const viewRef = useRef(view);
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
  }, [view]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let interiorShell: Group | null = null;
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
    runtimeRef.current = { cameraController, controls };

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
      const delta = Math.min(timer.getDelta(), 0.05);
      cameraController.update(delta);
      controls.enabled = startedRef.current && viewRef.current === "three" && !cameraController.isAnimating;
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    async function loadStandardConfiguration() {
      try {
        interiorShell = createInteriorShell();
        scene.add(interiorShell);

        const [gasCabinet, fryer, hygiene, fridge, gasGriddles, hood, splashGuard, countertopStand] =
          await Promise.all([
            loadConfiguratorModel("/configurator-models/interieur/moebel/Gasschrank.glb"),
            loadConfiguratorModel("/configurator-models/interieur/kochen/Doppelfriteuse.glb"),
            loadConfiguratorModel("/configurator-models/interieur/hygiene/Hygienebereich.glb"),
            loadConfiguratorModel("/configurator-models/interieur/kuehlung/Kuehlschrank_Unterbau.glb"),
            loadConfiguratorModel("/configurator-models/interieur/kochen/Gasbraeter.glb"),
            loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb"),
            loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Spritzschutz_700.glb"),
            loadConfiguratorModel("/configurator-models/interieur/arbeitsflaechen/Arbeitsplatten_Staender.glb"),
          ]);
        if (disposed) return;

        GAS_CABINET_EXTERNAL_CONNECTIONS.forEach((nodeName) => {
          gasCabinet.scene.getObjectByName(nodeName)?.removeFromParent();
        });

        scene.add(
          prepareModel(gasCabinet.scene, Math.PI / 2, { minX: -1.8, minY: 0, minZ: -1 }),
          prepareModel(fryer.scene, -Math.PI / 2, { minX: -1.09, minY: 0.4328, minZ: -1, width: 0.59 }),
          prepareModel(hygiene.scene, -Math.PI / 2, { minX: 0.15, minY: 0, minZ: -1, width: 1 }),
          prepareModel(fridge.scene, -Math.PI / 2, { minX: 1.2, minY: 0, minZ: -1, width: 0.6, height: 0.81 }),
          prepareModel(gasGriddles.scene, Math.PI / 2, { centerX: 0, minY: 0.6, minZ: 0.4 }),
          prepareModel(hood.scene, -Math.PI / 2, { minX: -1.09, minY: 1.36, minZ: -1, width: 0.6 }),
          prepareModel(splashGuard.scene, Math.PI / 2, { centerX: 0, minY: 0.85, maxZ: 1 }),
          ...FRONT_COUNTERTOP_STAND_POSITIONS.map(([centerX, centerZ]) =>
            prepareModel(countertopStand.scene.clone(), 0, { centerX, minY: 0, centerZ }),
          ),
        );

        setStatus("ready");
      } catch (error) {
        console.error("Configurator model loading failed:", error);
        if (!disposed) setStatus("error");
      }
    }
    void loadStandardConfiguration();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      studioEnvironment.dispose();
      if (interiorShell) disposeGroup(interiorShell);
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
