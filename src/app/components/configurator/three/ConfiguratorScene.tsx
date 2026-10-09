import { useEffect, useRef, useState } from "react";
import {
  AgXToneMapping,
  AmbientLight,
  AnimationAction,
  AnimationMixer,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Timer,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { standardEquipment, trailerConfiguration } from "../data/defaultConfiguration";
import type { ConfiguratorView } from "../types";
import { configurationToWorld } from "../utils/coordinates";
import { WatermarkOverlay } from "../WatermarkOverlay";
import { useConfiguratorCopy } from "../copy";
import { CameraController } from "./CameraController";
import { cameraPresets } from "./cameraPresets";
import { loadConfiguratorModel, selectModelVariant } from "./ModelLoader";
import { applyConfiguratorViewVisibility } from "./viewVisibility";

type ConfiguratorSceneProps = {
  view: ConfiguratorView;
  started: boolean;
};

type SceneRuntime = {
  cameraController: CameraController;
  controls: OrbitControls;
  layoutGroup: Group;
  frontRow: Group;
  backRow: Group;
  mixer: AnimationMixer | null;
  flapAction: AnimationAction | null;
  flapOpened: boolean;
  model: Group | null;
};

function createStudioBackgroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the configurator studio background");
  }

  const gradient = context.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.38,
    0,
    canvas.width * 0.5,
    canvas.height * 0.45,
    canvas.width * 0.72,
  );
  gradient.addColorStop(0, "#fffdf8");
  gradient.addColorStop(0.45, "#f7f3ec");
  gradient.addColorStop(1, "#ded8cf");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
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
    const runtime = runtimeRef.current;
    if (!runtime || !started) return;

    if (runtime.flapAction && !runtime.flapOpened) {
      runtime.flapOpened = true;
      runtime.flapAction.reset();
      runtime.flapAction.paused = false;
      runtime.flapAction.play();
    }

    runtime.cameraController.moveTo(cameraPresets.interior, 1250);
  }, [started]);

  useEffect(() => {
    viewRef.current = view;
    const runtime = runtimeRef.current;
    if (!runtime) return;

    runtime.layoutGroup.scale.x = view === "top" || view === "rear" ? 1 : -1;
    applyConfiguratorViewVisibility(runtime.model ?? new Group(), view, {
      frontRow: runtime.frontRow,
      backRow: runtime.backRow,
    });
    runtime.cameraController.moveTo(cameraPresets[view], 850);
  }, [view]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    const scene = new Scene();
    const studioBackgroundTexture = createStudioBackgroundTexture();
    scene.background = studioBackgroundTexture;
    scene.fog = new Fog(0xded8cf, 9, 24);

    const camera = new PerspectiveCamera(cameraPresets.three.fov, 1, 0.05, 100);
    camera.position.set(...cameraPresets.three.position);
    camera.up.set(...cameraPresets.three.up);

    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = AgXToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute("aria-label", sceneLabel);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...cameraPresets.three.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enabled = false;
    controls.enableRotate = true;
    controls.minDistance = 2.15;
    controls.maxDistance = 13;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.update();

    const cameraController = new CameraController(camera, controls);
    const runtime: SceneRuntime = {
      cameraController,
      controls,
      layoutGroup: new Group(),
      frontRow: new Group(),
      backRow: new Group(),
      mixer: null,
      flapAction: null,
      flapOpened: false,
      model: null,
    };
    runtime.layoutGroup.scale.x = -1;
    runtime.frontRow.name = "frontRow";
    runtime.backRow.name = "backRow";
    runtime.layoutGroup.add(runtime.frontRow, runtime.backRow);
    runtimeRef.current = runtime;
    scene.add(runtime.layoutGroup);

    scene.add(new AmbientLight(0xfffbf4, 0.65));
    const hemisphere = new HemisphereLight(0xfffbf4, 0xc8bcae, 1);
    scene.add(hemisphere);
    const keyLight = new DirectionalLight(0xfff6e9, 1.9);
    keyLight.position.set(-3.5, 8, -3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.015;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);
    const fillLight = new DirectionalLight(0xeef3f0, 0.9);
    fillLight.position.set(4.5, 4.5, -1.5);
    scene.add(fillLight);
    const rimLight = new DirectionalLight(0xfff2dc, 0.35);
    rimLight.position.set(0, 5, 5.5);
    scene.add(rimLight);

    const ground = new Mesh(
      new PlaneGeometry(30, 30),
      new MeshStandardMaterial({ color: 0xf1ebe2, roughness: 0.96, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.4;
    ground.receiveShadow = true;
    scene.add(ground);

    const worktopMaterial = new MeshStandardMaterial({
      color: 0xb9bfba,
      roughness: 0.32,
      metalness: 0.7,
    });
    const worktopMeshes = trailerConfiguration.worktopBandsCm.map((band) => {
      const thickness = band.thicknessCm / 100;
      const mesh = new Mesh(
        new BoxGeometry(
          (band.longitudinalEnd - band.longitudinalStart) / 100,
          thickness,
          (band.depthEnd - band.depthStart) / 100,
        ),
        worktopMaterial,
      );
      const [x, , z] = configurationToWorld({
        longitudinal: (band.longitudinalStart + band.longitudinalEnd) / 2,
        height: band.heightCm - band.thicknessCm / 2,
        depth: (band.depthStart + band.depthEnd) / 2,
      });
      mesh.position.set(x, band.heightCm / 100 - thickness / 2, z);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      const row = band.id.startsWith("closed-wall") ? runtime.backRow : runtime.frontRow;
      row.add(mesh);
      return mesh;
    });

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

      if (runtime.mixer && runtime.flapAction && !runtime.flapAction.paused) {
        runtime.mixer.update(delta);
        if (runtime.flapAction.time >= trailerConfiguration.animation.sellingFlapOpenTimeSeconds) {
          runtime.flapAction.time = trailerConfiguration.animation.sellingFlapOpenTimeSeconds;
          runtime.flapAction.paused = true;
          runtime.mixer.update(0);
        }
      }

      controls.enabled = startedRef.current && viewRef.current === "three" && !cameraController.isAnimating;
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };
    render();

    async function loadSceneModels() {
      try {
        const trailer = await loadConfiguratorModel(trailerConfiguration.modelPath);
        if (disposed) return;

        trailer.scene.scale.setScalar(trailerConfiguration.scale);
        trailer.scene.position.set(...trailerConfiguration.modelPosition);
        trailer.scene.traverse((object) => {
          if (object instanceof Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        scene.add(trailer.scene);
        runtime.model = trailer.scene;
        applyConfiguratorViewVisibility(trailer.scene, viewRef.current, {
          frontRow: runtime.frontRow,
          backRow: runtime.backRow,
        });

        const flapClip = trailer.animations.find(
          (clip) => clip.name === trailerConfiguration.animation.sellingFlapClip,
        );
        if (flapClip) {
          runtime.mixer = new AnimationMixer(trailer.scene);
          runtime.flapAction = runtime.mixer.clipAction(flapClip);
          runtime.flapAction.setLoop(LoopOnce, 1);
          runtime.flapAction.clampWhenFinished = true;
          runtime.flapAction.paused = true;
        }

        const confirmedEquipment = standardEquipment.filter(
          (item) => item.placementStatus === "confirmed" && item.positionCm && item.modelPath,
        );
        await Promise.all(confirmedEquipment.map(async (item) => {
          if (!item.positionCm || !item.modelPath) return;
          const equipment = await loadConfiguratorModel(item.modelPath);
          if (disposed) return;
          const selectedModel = selectModelVariant(equipment.scene, item.sceneNodeName);
          selectedModel.scale.setScalar(trailerConfiguration.scale);
          selectedModel.position.set(...configurationToWorld(item.positionCm));
          selectedModel.rotation.y = ((item.rotationDeg ?? 0) * Math.PI) / 180;
          const row = item.side === "closed-wall" ? runtime.backRow : runtime.frontRow;
          row.add(selectedModel);
        }));

        if (startedRef.current) {
          if (runtime.flapAction) {
            runtime.flapOpened = true;
            runtime.flapAction.reset();
            runtime.flapAction.paused = false;
            runtime.flapAction.play();
          }
          cameraController.moveTo(cameraPresets.interior, 1250);
        }

        setStatus("ready");
      } catch (error) {
        console.error("Configurator model loading failed:", error);
        if (!disposed) setStatus("error");
      }
    }
    void loadSceneModels();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      studioBackgroundTexture.dispose();
      ground.geometry.dispose();
      (ground.material as MeshStandardMaterial).dispose();
      worktopMeshes.forEach((mesh) => mesh.geometry.dispose());
      worktopMaterial.dispose();
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
