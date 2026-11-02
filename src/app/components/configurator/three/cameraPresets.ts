import type { CameraPresetDefinition, ConfiguratorView } from "../types";

export const cameraPresets: Record<ConfiguratorView | "interior", CameraPresetDefinition> = {
  three: {
    position: [1.2, 2.05, 2.55],
    target: [-0.35, 1.05, 0],
    up: [0, 1, 0],
    fov: 62,
  },
  top: {
    position: [0, 9.5, 0],
    target: [0, 0, 0],
    up: [0, 0, -1],
    fov: 26,
  },
  front: {
    position: [0, 1.42, 3.05],
    target: [0, 1.08, -0.1],
    up: [0, 1, 0],
    fov: 50,
  },
  rear: {
    position: [0, 1.42, -3.05],
    target: [0, 1.08, 0.1],
    up: [0, 1, 0],
    fov: 50,
  },
  interior: {
    position: [1.2, 2.05, 2.55],
    target: [-0.35, 1.05, 0],
    up: [0, 1, 0],
    fov: 62,
  },
};
