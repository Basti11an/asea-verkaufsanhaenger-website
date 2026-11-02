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

const STUDIO_BACKGROUND_BOTTOM = 0xb9dca2;

function createStudioBackgroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the configurator studio background");
  }

  const verticalGradient = context.createLinearGradient(0, 0, 0, canvas.height);
  verticalGradient.addColorStop(0, "#277bc4");
  verticalGradient.addColorStop(0.48, "#79b9e8");
  verticalGradient.addColorStop(0.7, "#d9edf6");
  verticalGradient.addColorStop(1, "#b9dca2");
  context.fillStyle = verticalGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const clouds = [
    [150, 170, 145], [440, 125, 110], [770, 205, 165], [930, 95, 90],
  ] as const;
  clouds.forEach(([x, y, radius]) => {
    const cloud = context.createRadialGradient(x, y, radius * 0.08, x, y, radius);
    cloud.addColorStop(0, "rgba(255,255,255,0.86)");
    cloud.addColorStop(0.5, "rgba(255,255,255,0.52)");
    cloud.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = cloud;
    context.fillRect(x - radius, y - radius * 0.55, radius * 2, radius * 1.1);
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the configurator grass texture");

  context.fillStyle = "#5f9147";
  context.fillRect(0, 0, canvas.width, canvas.height);
  let seed = 17;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let index = 0; index < 1800; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    context.strokeStyle = random() > 0.5 ? "#477b3c" : "#78a94e";
    context.lineWidth = 1 + random() * 1.5;
    context.beginPath();
    context.moveTo(x, y + 4);
    context.lineTo(x - 2 + random() * 4, y - 3 - random() * 6);
    context.stroke();
  }

  for (let index = 0; index < 36; index += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    context.fillStyle = random() > 0.5 ? "#f6e8a6" : "#f8f8ed";
    context.beginPath();
    context.arc(x, y, 3.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#e6b94b";
    context.beginPath();
    context.arc(x, y, 1.2, 0, Math.PI * 2);
    context.fill();
  }

  for (let index = 0; index < 28; index += 1) {
    context.fillStyle = "rgba(116, 116, 103, 0.55)";
    context.beginPath();
    context.ellipse(random() * canvas.width, random() * canvas.height, 5 + random() * 7, 3 + random() * 4, random(), 0, Math.PI * 2);
    context.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(18, 18);
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

  const grassTexture = createGrassTexture();
  const floorMaterial = new MeshStandardMaterial({
    map: grassTexture,
    color: 0xffffff,
    roughness: 0.96,
    metalness: 0,
  });
  const floor = new Mesh(new PlaneGeometry(160, 160), floorMaterial);
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
      grassTexture.dispose();
      floorMaterial.dispose();
      keyLight.shadow.dispose();
      environmentTarget.dispose();
      pmremGenerator.dispose();
      roomEnvironment.dispose();
      backgroundTexture.dispose();
    },
  };
}
