import { PerspectiveCamera, Vector3 } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { CameraPresetDefinition } from "../types";

type CameraTransition = {
  elapsed: number;
  duration: number;
  fromPosition: Vector3;
  fromTarget: Vector3;
  fromUp: Vector3;
  fromFov: number;
  toPosition: Vector3;
  toTarget: Vector3;
  toUp: Vector3;
  toFov: number;
};

export class CameraController {
  private transition: CameraTransition | null = null;

  constructor(
    private readonly camera: PerspectiveCamera,
    private readonly controls: OrbitControls,
  ) {}

  moveTo(preset: CameraPresetDefinition, duration = 900) {
    this.transition = {
      elapsed: 0,
      duration,
      fromPosition: this.camera.position.clone(),
      fromTarget: this.controls.target.clone(),
      fromUp: this.camera.up.clone(),
      fromFov: this.camera.fov,
      toPosition: new Vector3(...preset.position),
      toTarget: new Vector3(...preset.target),
      toUp: new Vector3(...preset.up),
      toFov: preset.fov,
    };
    this.controls.enabled = false;
  }

  update(deltaSeconds: number) {
    if (!this.transition) return false;

    this.transition.elapsed += deltaSeconds * 1000;
    const linearProgress = Math.min(this.transition.elapsed / this.transition.duration, 1);
    const progress = linearProgress * linearProgress * (3 - 2 * linearProgress);

    this.camera.position.lerpVectors(
      this.transition.fromPosition,
      this.transition.toPosition,
      progress,
    );
    this.controls.target.lerpVectors(
      this.transition.fromTarget,
      this.transition.toTarget,
      progress,
    );
    this.camera.up.lerpVectors(this.transition.fromUp, this.transition.toUp, progress).normalize();
    this.camera.fov = this.transition.fromFov + (this.transition.toFov - this.transition.fromFov) * progress;
    this.camera.updateProjectionMatrix();
    this.controls.update();

    if (linearProgress === 1) {
      this.transition = null;
      return false;
    }

    return true;
  }

  get isAnimating() {
    return this.transition !== null;
  }
}
