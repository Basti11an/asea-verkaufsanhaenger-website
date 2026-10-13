import {
  ACESFilmicToneMapping,
  CanvasTexture,
  DirectionalLight,
  Fog,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const STUDIO_BACKGROUND_BOTTOM = 0xe7e2d9;

function createStudioBackgroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the configurator studio background");
  }

  const verticalGradient = context.createLinearGradient(0, 0, 0, canvas.height);
  verticalGradient.addColorStop(0, "#f8f6f1");
  verticalGradient.addColorStop(0.08, "#f3efe7");
  verticalGradient.addColorStop(0.18, "#e7e2d9");
  verticalGradient.addColorStop(1, "#e7e2d9");
  context.fillStyle = verticalGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const lightSpot = context.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.44,
    0,
    canvas.width * 0.5,
    canvas.height * 0.44,
    canvas.width * 0.58,
  );
  lightSpot.addColorStop(0, "rgba(255, 253, 248, 0.2)");
  lightSpot.addColorStop(0.48, "rgba(255, 253, 248, 0.08)");
  lightSpot.addColorStop(1, "rgba(255, 253, 248, 0)");
  context.fillStyle = lightSpot;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function configureKeyShadow(light: DirectionalLight) {
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = -4.5;
  light.shadow.camera.right = 4.5;
  light.shadow.camera.top = 4.5;
  light.shadow.camera.bottom = -2.5;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 22;
  light.shadow.bias = -0.00025;
  light.shadow.normalBias = 0.025;
  light.shadow.radius = 2;
}

export function installStudioEnvironment(scene: Scene, renderer: WebGLRenderer) {
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const backgroundTexture = createStudioBackgroundTexture();
  scene.background = backgroundTexture;
  scene.fog = new Fog(STUDIO_BACKGROUND_BOTTOM, 11, 28);

  const roomEnvironment = new RoomEnvironment();
  const pmremGenerator = new PMREMGenerator(renderer);
  const environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = 0.5;

  const lightTarget = new Object3D();
  lightTarget.position.set(0, 1, 0);
  scene.add(lightTarget);

  const keyLight = new DirectionalLight(0xfff8ed, 1.85);
  keyLight.position.set(-5, 8, 6);
  keyLight.target = lightTarget;
  configureKeyShadow(keyLight);
  scene.add(keyLight);

  const fillLight = new DirectionalLight(0xffffff, 0.55);
  fillLight.position.set(5, 4, 2);
  fillLight.target = lightTarget;
  scene.add(fillLight);

  const rimLight = new DirectionalLight(0xfff4e6, 0.6);
  rimLight.position.set(2, 6, -6);
  rimLight.target = lightTarget;
  scene.add(rimLight);

  const floorMaterial = new MeshStandardMaterial({
    color: 0xe7e3db,
    roughness: 0.9,
    metalness: 0,
  });
  const floor = new Mesh(new PlaneGeometry(32, 32), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.4;
  floor.receiveShadow = true;
  scene.add(floor);

  return {
    dispose() {
      scene.remove(floor, keyLight, fillLight, rimLight, lightTarget);
      scene.background = null;
      scene.environment = null;
      scene.fog = null;
      floor.geometry.dispose();
      floorMaterial.dispose();
      keyLight.shadow.dispose();
      environmentTarget.dispose();
      pmremGenerator.dispose();
      roomEnvironment.dispose();
      backgroundTexture.dispose();
    },
  };
}
