import type { CameraPresetDefinition, ConfiguratorView } from "../types";

export const cameraPresets: Record<ConfiguratorView | "interior", CameraPresetDefinition> = {
  three: {
    position: [5.7, 4, 6.5],
    target: [-0.7, 1.15, 0],
    up: [0, 1, 0],
    fov: 34,
  },
  top: {
    position: [0, 11, 0],
    target: [0, 0, 0],
    up: [0, 0, -1],
    fov: 24,
  },
  front: {
    position: [-0.2, 2, -7],
    target: [-0.2, 1.15, 0],
    up: [0, 1, 0],
    fov: 32,
  },
  rear: {
    position: [-0.2, 2, 7],
    target: [-0.2, 1.15, 0],
    up: [0, 1, 0],
    fov: 32,
  },
  interior: {
    position: [4.9, 2.35, -6.4],
    target: [0, 1.05, -0.25],
    up: [0, 1, 0],
    fov: 38,
  },
};
