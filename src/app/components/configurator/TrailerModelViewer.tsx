import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = `${import.meta.env.BASE_URL}configurator-models/trailer/Anhaenger2.glb`;

export function TrailerModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;
    let model: THREE.Object3D | null = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#eef0f1');

    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    camera.position.set(4, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = 'block h-full w-full';
    renderer.domElement.setAttribute('aria-label', '3D-Anhängeransicht');
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8b8f94, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd9e4f2, 1.4);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const frameModel = (loadedModel: THREE.Object3D) => {
      const bounds = new THREE.Box3().setFromObject(loadedModel);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const radius = Math.max(maxDimension * 0.5, 0.1);

      loadedModel.position.sub(center);
      camera.near = Math.max(radius / 100, 0.001);
      camera.far = Math.max(radius * 100, 100);
      camera.position.set(radius * 2.8, radius * 1.7, radius * 2.8);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.minDistance = radius * 1.15;
      controls.maxDistance = radius * 8;
      camera.updateProjectionMatrix();
      controls.update();
    };

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;

        model = gltf.scene;
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        scene.add(model);
        frameModel(model);
        setStatus('ready');
      },
      undefined,
      (error) => {
        if (disposed) return;
        console.error('3D trailer model could not be loaded.', error);
        setStatus('error');
      },
    );

    const render = () => {
      animationFrame = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (model) {
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
      }
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden rounded-xl border border-[#d9d9d6] bg-[#eef0f1] shadow-sm md:h-[70vh]">
      {status === 'loading' && (
        <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-[#77756f]">
          3D-Modell wird geladen …
        </p>
      )}
      {status === 'error' && (
        <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm text-[#77756f]">
          Das 3D-Modell konnte nicht geladen werden.
        </p>
      )}
      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}
