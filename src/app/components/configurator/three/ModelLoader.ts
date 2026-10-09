import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Group } from "three";

const loader = new GLTFLoader();
const modelCache = new Map<string, Promise<GLTF>>();

function loadOnce(path: string) {
  const cached = modelCache.get(path);
  if (cached) return cached;

  const request = loader.loadAsync(path);
  modelCache.set(path, request);
  return request;
}

export async function loadConfiguratorModel(path: string) {
  const gltf = await loadOnce(path);

  return {
    scene: clone(gltf.scene),
    animations: gltf.animations,
  };
}

export function selectModelVariant(scene: Group, sceneNodeName: string | null) {
  if (!sceneNodeName) return scene;

  const node = scene.getObjectByName(sceneNodeName);
  if (!node) {
    throw new Error(`Model node not found: ${sceneNodeName}`);
  }

  const selectedScene = new Group();
  selectedScene.name = `${sceneNodeName}_Selection`;
  node.removeFromParent();
  node.position.set(0, 0, 0);
  selectedScene.add(node);
  return selectedScene;
}
