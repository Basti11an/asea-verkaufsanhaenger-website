import {
  PerspectiveCamera,
  SRGBColorSpace,
  WebGLRenderer,
  WebGLRenderTarget,
  type Scene,
  type Vector3,
} from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ConfiguratorView } from "../types";
import { cameraPresets } from "./cameraPresets";

export type ConfigurationScreenshots = {
  top: string;
  front: string;
  rear: string;
};

type CaptureOptions = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  currentView: ConfiguratorView;
  applyViewVisibility: (view: ConfiguratorView) => void;
};

type CameraSnapshot = {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;
  aspect: number;
};

const CAPTURE_WIDTH = 1200;
const CAPTURE_HEIGHT = 760;

function applyPreset(camera: PerspectiveCamera, controls: OrbitControls, view: "top" | "front" | "rear") {
  const preset = cameraPresets[view];
  camera.position.set(...preset.position);
  camera.up.set(...preset.up);
  camera.fov = preset.fov;
  camera.aspect = CAPTURE_WIDTH / CAPTURE_HEIGHT;
  camera.updateProjectionMatrix();
  controls.target.set(...preset.target);
  controls.update();
}

function pixelsToJpeg(pixels: Uint8Array) {
  const canvas = document.createElement("canvas");
  canvas.width = CAPTURE_WIDTH;
  canvas.height = CAPTURE_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Screenshot canvas is unavailable.");

  const imageData = context.createImageData(CAPTURE_WIDTH, CAPTURE_HEIGHT);
  const rowLength = CAPTURE_WIDTH * 4;
  for (let sourceY = 0; sourceY < CAPTURE_HEIGHT; sourceY += 1) {
    const sourceStart = sourceY * rowLength;
    const targetStart = (CAPTURE_HEIGHT - sourceY - 1) * rowLength;
    imageData.data.set(pixels.subarray(sourceStart, sourceStart + rowLength), targetStart);
  }
  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.78);
}

export function captureConfigurationScreenshots({
  renderer,
  scene,
  camera,
  controls,
  currentView,
  applyViewVisibility,
}: CaptureOptions): ConfigurationScreenshots {
  const snapshot: CameraSnapshot = {
    position: camera.position.clone(),
    target: controls.target.clone(),
    up: camera.up.clone(),
    fov: camera.fov,
    aspect: camera.aspect,
  };
  const previousRenderTarget = renderer.getRenderTarget();
  const renderTarget = new WebGLRenderTarget(CAPTURE_WIDTH, CAPTURE_HEIGHT, { samples: 4 });
  renderTarget.texture.colorSpace = SRGBColorSpace;
  const pixels = new Uint8Array(CAPTURE_WIDTH * CAPTURE_HEIGHT * 4);

  try {
    renderer.setRenderTarget(renderTarget);
    const result = {} as ConfigurationScreenshots;

    (["top", "front", "rear"] as const).forEach((view) => {
      applyPreset(camera, controls, view);
      applyViewVisibility(view);
      renderer.render(scene, camera);
      renderer.readRenderTargetPixels(renderTarget, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT, pixels);
      result[view] = pixelsToJpeg(pixels);
    });

    return result;
  } finally {
    renderer.setRenderTarget(previousRenderTarget);
    renderTarget.dispose();
    camera.position.copy(snapshot.position);
    camera.up.copy(snapshot.up);
    camera.fov = snapshot.fov;
    camera.aspect = snapshot.aspect;
    camera.updateProjectionMatrix();
    controls.target.copy(snapshot.target);
    controls.update();
    applyViewVisibility(currentView);
    renderer.render(scene, camera);
  }
}
