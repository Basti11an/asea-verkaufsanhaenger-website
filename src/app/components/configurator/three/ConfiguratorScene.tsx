import { useEffect, useRef, useState } from "react";
import {
  Box3,
  BoxGeometry,
  CylinderGeometry,
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
  width?: number;
};

const MODEL_SCALE = 0.1;

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
  const steel = new MeshStandardMaterial({ color: 0x777a75, roughness: 0.36, metalness: 0.7 });
  const width = endX - startX;
  addBox(parent, [width, 0.04, depth], [(startX + endX) / 2, 0.83, centerZ], steel);

  const legMaterial = new MeshStandardMaterial({ color: 0x8a8d88, roughness: 0.3, metalness: 0.75 });
  [startX + 0.045, endX - 0.045].forEach((x) => {
    [centerZ - depth / 2 + 0.045, centerZ + depth / 2 - 0.045].forEach((z) => {
      const leg = new Mesh(new CylinderGeometry(0.018, 0.018, 0.81, 12), legMaterial);
      leg.position.set(x, 0.405, z);
      leg.castShadow = true;
      parent.add(leg);
    });
  });
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
  addCountertop(shell, -0.55, -0.4185, 0.7);
  addCountertop(shell, 0.4185, 0.55, 0.7);

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

  const center = bounds.getCenter(new Vector3());
  const offset = new Vector3(0, placement.minY - bounds.min.y, 0);
  if (placement.minX !== undefined) offset.x = placement.minX - bounds.min.x;
  if (placement.centerX !== undefined) offset.x = placement.centerX - center.x;
  if (placement.minZ !== undefined) offset.z = placement.minZ - bounds.min.z;
  if (placement.maxZ !== undefined) offset.z = placement.maxZ - bounds.max.z;
  model.position.add(offset);

  model.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
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

        const [gasCabinet, fryer, hygiene, gasGriddles, worktableLeft, worktableRight, hood] =
          await Promise.all([
            loadConfiguratorModel("/configurator-models/interieur/moebel/Gasschrank.glb"),
            loadConfiguratorModel("/configurator-models/interieur/kochen/Doppelfriteuse.glb"),
            loadConfiguratorModel("/configurator-models/interieur/hygiene/Hygienebereich.glb"),
            loadConfiguratorModel("/configurator-models/interieur/kochen/Gasbraeter.glb"),
            loadConfiguratorModel("/configurator-models/interieur/moebel/Arbeitstisch_1200.glb"),
            loadConfiguratorModel("/configurator-models/interieur/moebel/Arbeitstisch_1200.glb"),
            loadConfiguratorModel("/configurator-models/interieur/lueftung-und-schutz/Dunstabzug_600.glb"),
          ]);
        if (disposed) return;

        scene.add(
          prepareModel(gasCabinet.scene, -Math.PI / 2, { minX: -1.8, minY: 0, minZ: -1 }),
          prepareModel(fryer.scene, -Math.PI / 2, { minX: -1.09, minY: 0.85, minZ: -1, width: 0.59 }),
          prepareModel(hygiene.scene, -Math.PI / 2, { minX: 0.15, minY: 0, minZ: -1, width: 1 }),
          prepareModel(gasGriddles.scene, Math.PI / 2, { centerX: 0, minY: 0.571, maxZ: 1 }),
          prepareModel(worktableLeft.scene, Math.PI / 2, { minX: -1.8, minY: 0, maxZ: 1, width: 1.25 }),
          prepareModel(worktableRight.scene, Math.PI / 2, { minX: 0.55, minY: 0, maxZ: 1, width: 1.25 }),
          prepareModel(hood.scene, -Math.PI / 2, { minX: -1.09, minY: 1.36, minZ: -1, width: 0.6 }),
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
