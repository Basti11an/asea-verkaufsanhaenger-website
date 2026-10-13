import { useEffect, useRef, useState } from "react";
import {
  AnimationAction,
  AnimationMixer,
  Group,
  LoopOnce,
  Mesh,
  Plane,
  PerspectiveCamera,
  Scene,
  Timer,
  WebGLRenderer,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { trailerConfiguration } from "../data/defaultConfiguration";
import type { ConfiguratorView } from "../types";
import { WatermarkOverlay } from "../WatermarkOverlay";
import { useConfiguratorCopy } from "../copy";
import { CameraController } from "./CameraController";
import { cameraPresets } from "./cameraPresets";
import { loadConfiguratorModel } from "./ModelLoader";
import { installStudioEnvironment } from "./StudioEnvironment";
import { applyConfiguratorViewVisibility } from "./viewVisibility";

type ConfiguratorSceneProps = {
  view: ConfiguratorView;
  started: boolean;
};

type SceneRuntime = {
  cameraController: CameraController;
  controls: OrbitControls;
  mixer: AnimationMixer | null;
  flapAction: AnimationAction | null;
  flapOpened: boolean;
  model: Group | null;
  rearCutaway: RearCutaway | null;
};

type RearCutaway = {
  setEnabled: (enabled: boolean) => void;
  dispose: () => void;
};

const rearCutPlane = new Plane(new Vector3(0, 0, -1), 0.85);

function createRearCutaway(model: Group): RearCutaway | null {
  const shell = model.getObjectByName(trailerConfiguration.sceneNodes.outerShell);
  if (!(shell instanceof Mesh)) return null;

  const sourceMaterials = Array.isArray(shell.material) ? shell.material : [shell.material];
  const cutawayMaterials = sourceMaterials.map((material) => material.clone());
  shell.material = Array.isArray(shell.material) ? cutawayMaterials : cutawayMaterials[0];

  function setEnabled(enabled: boolean) {
    cutawayMaterials.forEach((material) => {
      material.clippingPlanes = enabled ? [rearCutPlane] : [];
      material.clipShadows = enabled;
      material.needsUpdate = true;
    });
  }

  return {
    setEnabled,
    dispose: () => cutawayMaterials.forEach((material) => material.dispose()),
  };
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

    if (runtime.model) applyConfiguratorViewVisibility(runtime.model, view);
    runtime.rearCutaway?.setEnabled(view === "rear");
    runtime.cameraController.moveTo(cameraPresets[view], 850);
  }, [view]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    const scene = new Scene();

    const camera = new PerspectiveCamera(cameraPresets.three.fov, 1, 0.05, 100);
    camera.position.set(...cameraPresets.three.position);
    camera.up.set(...cameraPresets.three.up);

    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.localClippingEnabled = true;
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
    controls.enableRotate = true;
    controls.minDistance = 2.15;
    controls.maxDistance = 13;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.update();

    const cameraController = new CameraController(camera, controls);
    const runtime: SceneRuntime = {
      cameraController,
      controls,
      mixer: null,
      flapAction: null,
      flapOpened: false,
      model: null,
      rearCutaway: null,
    };
    runtimeRef.current = runtime;

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
        runtime.rearCutaway = createRearCutaway(trailer.scene);
        applyConfiguratorViewVisibility(trailer.scene, viewRef.current);
        runtime.rearCutaway?.setEnabled(viewRef.current === "rear");

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
      studioEnvironment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      runtime.rearCutaway?.dispose();
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
